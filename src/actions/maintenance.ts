"use server";

import { prisma } from '../lib/db';
import {
  startMaintenanceSchema,
  finishMaintenanceSchema,
  MaintenanceStatus,
} from '../lib/validators/maintenance';
import { VehicleStatus } from '../lib/validators/trips';

/**
 * Initiates maintenance for a vehicle. Sets the vehicle's status to IN_SHOP.
 */
export async function startMaintenance(input: {
  vehicleId: string;
  garage: string;
  description: string;
  startDate: Date | string;
}) {
  const parsed = startMaintenanceSchema.parse(input);

  return await prisma.$transaction(async (tx) => {
    // Check vehicle existence and status
    const vehicle = await tx.vehicle.findUnique({
      where: { id: parsed.vehicleId },
    });

    if (!vehicle) {
      throw new Error(`Vehicle with ID ${parsed.vehicleId} not found`);
    }

    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new Error(
        `Vehicle is not AVAILABLE for maintenance (current status: ${vehicle.status})`
      );
    }

    // Set Vehicle status to IN_SHOP
    await tx.vehicle.update({
      where: { id: parsed.vehicleId },
      data: { status: VehicleStatus.IN_SHOP },
    });

    // Create Maintenance record
    const maintenance = await tx.maintenance.create({
      data: {
        vehicleId: parsed.vehicleId,
        garage: parsed.garage,
        description: parsed.description,
        startDate: parsed.startDate,
        cost: 0,
        status: MaintenanceStatus.INITIATED,
      },
      include: {
        vehicle: true,
      },
    });

    return maintenance;
  });
}

/**
 * Finishes maintenance, saving final costs and ending date, and releasing the vehicle to AVAILABLE.
 */
export async function finishMaintenance(
  maintenanceId: string,
  input: { cost: number; endDate: Date | string }
) {
  if (!maintenanceId) {
    throw new Error('Maintenance ID is required');
  }

  const parsed = finishMaintenanceSchema.parse(input);

  return await prisma.$transaction(async (tx) => {
    const maintenance = await tx.maintenance.findUnique({
      where: { id: maintenanceId },
    });

    if (!maintenance) {
      throw new Error(`Maintenance record with ID ${maintenanceId} not found`);
    }

    if (maintenance.status !== MaintenanceStatus.INITIATED) {
      throw new Error(
        `Maintenance cannot be finished. Status must be INITIATED but is currently ${maintenance.status}`
      );
    }

    // Validate that end date is after start date
    const startDate = new Date(maintenance.startDate);
    const endDate = new Date(parsed.endDate);
    if (endDate < startDate) {
      throw new Error('End date cannot be before the start date');
    }

    // Update maintenance record
    const updatedMaintenance = await tx.maintenance.update({
      where: { id: maintenanceId },
      data: {
        cost: parsed.cost,
        endDate: parsed.endDate,
        status: MaintenanceStatus.COMPLETED,
      },
      include: {
        vehicle: true,
      },
    });

    // Update vehicle status back to AVAILABLE
    await tx.vehicle.update({
      where: { id: maintenance.vehicleId },
      data: { status: VehicleStatus.AVAILABLE },
    });

    return updatedMaintenance;
  });
}

export interface GetMaintenanceFilters {
  status?: keyof typeof MaintenanceStatus;
  vehicleId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Retrieves maintenance records matching filters, with pagination and vehicle include.
 */
export async function getMaintenance(filters: GetMaintenanceFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? 10);
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }

  if (filters.search) {
    where.OR = [
      { garage: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [maintenances, total] = await Promise.all([
    prisma.maintenance.findMany({
      where,
      skip,
      take: limit,
      include: {
        vehicle: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    }),
    prisma.maintenance.count({ where }),
  ]);

  return {
    maintenances,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
