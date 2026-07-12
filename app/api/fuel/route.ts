import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.fuelLog.findMany({
      include: { vehicle: true },
      orderBy: { loggedAt: "desc" },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fuel logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId, liters, costPerLiter, totalCost, mileageAt, station, loggedAt } = body;

    if (!vehicleId || !liters || !costPerLiter || !mileageAt) {
      return NextResponse.json(
        { error: "vehicleId, liters, costPerLiter, mileageAt are required" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const calculatedTotalCost = totalCost ? Number(totalCost) : Number(liters) * Number(costPerLiter);

    const log = await prisma.$transaction(async (tx) => {
      const newLog = await tx.fuelLog.create({
        data: {
          vehicleId,
          liters: Number(liters),
          costPerLiter: Number(costPerLiter),
          totalCost: calculatedTotalCost,
          mileageAt: Number(mileageAt),
          station: station || null,
          loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
        },
      });

      // Update vehicle odometer if this mileage reading is higher
      if (Number(mileageAt) > vehicle.odometer) {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { odometer: Number(mileageAt) },
        });
      }

      return newLog;
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    console.error("[Fuel Log Create Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to create fuel log" }, { status: 500 });
  }
}
