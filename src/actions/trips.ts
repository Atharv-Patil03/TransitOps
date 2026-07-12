"use server";

import { prisma } from '../lib/db';
import {
  createTripSchema,
  completeTripSchema,
  businessLogicSchema,
  TripStatus,
  VehicleStatus,
  DriverStatus,
  CreateTripInput,
  CompleteTripInput,
} from '../lib/validators/trips';

/**
 * Creates a new trip. Validates input and business rules before saving.
 */
export async function createTrip(input: CreateTripInput) {
  // Validate input schema
  const parsed = createTripSchema.parse(input);

  return await prisma.$transaction(async (tx) => {
    // Fetch associated Vehicle and Driver
    const vehicle = await tx.vehicle.findUnique({
      where: { id: parsed.vehicleId },
    });
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${parsed.vehicleId} does not exist`);
    }

    const driver = await tx.driver.findUnique({
      where: { id: parsed.driverId },
    });
    if (!driver) {
      throw new Error(`Driver with ID ${parsed.driverId} does not exist`);
    }

    // Run business logic validation using the Zod schema
    businessLogicSchema.parse({
      cargoWeight: parsed.cargoWeight,
      vehicle: {
        id: vehicle.id,
        capacity: vehicle.capacity,
        status: vehicle.status,
      },
      driver: {
        id: driver.id,
        status: driver.status,
        licenseExpiry: driver.licenseExpiry,
      },
    });

    // Create the trip
    const trip = await tx.trip.create({
      data: {
        source: parsed.source,
        destination: parsed.destination,
        cargoDesc: parsed.cargoDesc,
        cargoWeight: parsed.cargoWeight,
        plannedDist: parsed.plannedDist,
        departureDate: parsed.departureDate,
        expectedArrival: parsed.expectedArrival,
        status: TripStatus.DRAFT,
        notes: parsed.notes,
        vehicleId: parsed.vehicleId,
        driverId: parsed.driverId,
      },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    return trip;
  });
}

/**
 * Dispatches a trip, updating the trip status to DISPATCHED and vehicle/driver to ON_TRIP.
 */
export async function dispatchTrip(tripId: string) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }

  return await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true },
    });

    if (!trip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }

    if (trip.status !== TripStatus.DRAFT) {
      throw new Error(`Trip cannot be dispatched. Status must be DRAFT but is currently ${trip.status}`);
    }

    // Double check availability of vehicle and driver at dispatch time
    if (trip.vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new Error(`Vehicle is not AVAILABLE (status: ${trip.vehicle.status})`);
    }

    if (trip.driver.status !== DriverStatus.AVAILABLE) {
      throw new Error(`Driver is not AVAILABLE (status: ${trip.driver.status})`);
    }

    // Enforce driver license has not expired
    if (new Date(trip.driver.licenseExpiry) <= new Date()) {
      throw new Error('Driver license has expired');
    }

    // Update statuses
    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.DISPATCHED },
      include: { vehicle: true, driver: true },
    });

    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: VehicleStatus.ON_TRIP },
    });

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.ON_TRIP },
    });

    return updatedTrip;
  });
}

/**
 * Completes a trip, recording actual trip metrics and releasing vehicle/driver to AVAILABLE.
 */
export async function completeTrip(tripId: string, metrics: CompleteTripInput) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }

  const parsedMetrics = completeTripSchema.parse(metrics);

  return await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }

    if (trip.status !== TripStatus.DISPATCHED) {
      throw new Error(`Trip cannot be completed. Status must be DISPATCHED but is currently ${trip.status}`);
    }

    // Update trip with final metrics and COMPLETED status
    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.COMPLETED,
        actualDist: parsedMetrics.actualDist,
        finalOdometer: parsedMetrics.finalOdometer,
        fuelUsed: parsedMetrics.fuelUsed,
      },
      include: { vehicle: true, driver: true },
    });

    // Reset vehicle and driver back to AVAILABLE
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: VehicleStatus.AVAILABLE },
    });

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.AVAILABLE },
    });

    return updatedTrip;
  });
}

/**
 * Cancels a trip. If the trip was already dispatched, releases the vehicle and driver back to AVAILABLE.
 */
export async function cancelTrip(tripId: string) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }

  return await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }

    const uncancelableStatuses = [TripStatus.COMPLETED, TripStatus.CANCELLED];
    if (uncancelableStatuses.includes(trip.status as any)) {
      throw new Error(`Trip cannot be cancelled. Current status: ${trip.status}`);
    }

    const wasDispatched = trip.status === TripStatus.DISPATCHED;

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.CANCELLED },
      include: { vehicle: true, driver: true },
    });

    // If trip was dispatched, we must free the vehicle and driver
    if (wasDispatched) {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      });
    }

    return updatedTrip;
  });
}

export interface GetTripsFilters {
  status?: keyof typeof TripStatus;
  vehicleId?: string;
  driverId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Retrieves trips matching the given filters, with pagination and relational data.
 */
export async function getTrips(filters: GetTripsFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? 10);
  const skip = (page - 1) * limit;

  // Build prisma where clause
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }

  if (filters.driverId) {
    where.driverId = filters.driverId;
  }

  if (filters.search) {
    where.OR = [
      { source: { contains: filters.search } },
      { destination: { contains: filters.search } },
      { cargoDesc: { contains: filters.search } },
    ];
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      skip,
      take: limit,
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: {
        departureDate: 'desc',
      },
    }),
    prisma.trip.count({ where }),
  ]);

  return {
    trips,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Retrieves details for a specific trip, including vehicle and driver relationships.
 */
export async function getTripDetails(tripId: string) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      vehicle: true,
      driver: true,
    },
  });

  if (!trip) {
    throw new Error(`Trip with ID ${tripId} not found`);
  }

  return trip;
}
