import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { route: true, vehicle: true, driver: { include: { user: true } } },
    });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, odometerReading, fuelConsumed } = body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const previousStatus = existingTrip.status;

    // Enforce business rules based on status changes
    let vehicleStatusUpdate = undefined;
    let driverStatusUpdate = undefined;

    // 1. Dispatching a trip automatically changes both the vehicle and driver status to On Trip.
    if (status === "DISPATCHED" && previousStatus !== "DISPATCHED") {
      vehicleStatusUpdate = "ON_TRIP";
      driverStatusUpdate = "ON_TRIP";
    }

    // 2. Completing a trip automatically changes both the vehicle and driver status back to Available.
    if (status === "COMPLETED" && previousStatus === "DISPATCHED") {
      vehicleStatusUpdate = "AVAILABLE";
      driverStatusUpdate = "AVAILABLE";
    }

    // 3. Cancelling a dispatched trip restores the vehicle and driver to Available.
    if (status === "CANCELLED" && previousStatus === "DISPATCHED") {
      vehicleStatusUpdate = "AVAILABLE";
      driverStatusUpdate = "AVAILABLE";
    }

    // Update the Trip record
    const updatedTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      // Update vehicle status
      if (vehicleStatusUpdate && trip.vehicleId) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: {
            status: vehicleStatusUpdate as any,
            // If completing a trip, update the vehicle's odometer
            odometer: odometerReading ? { increment: Number(odometerReading) } : undefined,
          },
        });
      }

      // Update driver status
      if (driverStatusUpdate && trip.driverId) {
        await tx.driver.update({
          where: { id: trip.driverId },
          data: {
            status: driverStatusUpdate as any,
            totalTrips: status === "COMPLETED" ? { increment: 1 } : undefined,
          },
        });
      }

      // Record fuel consumption on completion if provided
      if (status === "COMPLETED" && fuelConsumed && trip.vehicleId) {
        await tx.fuelLog.create({
          data: {
            vehicleId: trip.vehicleId,
            liters: Number(fuelConsumed),
            costPerLiter: 95.0, // Default local estimate
            totalCost: Number(fuelConsumed) * 95.0,
            mileageAt: existingTrip.vehicle.odometer + (odometerReading ? Number(odometerReading) : 0),
          },
        });
      }

      return trip;
    });

    return NextResponse.json(updatedTrip);
  } catch (error: any) {
    console.error("[Trip Update API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to update trip" }, { status: 500 });
  }
}
