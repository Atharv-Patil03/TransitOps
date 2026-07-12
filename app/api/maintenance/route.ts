import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.maintenanceRecord.findMany({
      include: { vehicle: true },
      orderBy: { performedAt: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch maintenance logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId, type, description, cost, performedAt, nextDueAt, mileageAt, technician, status } = body;

    if (!vehicleId || !type || !description || !cost || !performedAt || !mileageAt) {
      return NextResponse.json(
        { error: "vehicleId, type, description, cost, performedAt, mileageAt are required" },
        { status: 400 }
      );
    }

    // Verify vehicle exists and is active
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    if (vehicle.status === "RETIRED") {
      return NextResponse.json({ error: "Cannot create maintenance log for a retired vehicle" }, { status: 400 });
    }

    // Create log and update vehicle status in a transaction
    const record = await prisma.$transaction(async (tx) => {
      const isPendingOrInProgress = status === "PENDING" || status === "IN_PROGRESS";

      const newRecord = await tx.maintenanceRecord.create({
        data: {
          vehicleId,
          type,
          description,
          cost: Number(cost),
          performedAt: new Date(performedAt),
          nextDueAt: nextDueAt ? new Date(nextDueAt) : null,
          mileageAt: Number(mileageAt),
          technician: technician || null,
          status: status ?? "COMPLETED",
        },
        include: { vehicle: true },
      });

      // "Creating an active maintenance record automatically changes vehicle status to In Shop."
      if (isPendingOrInProgress) {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: "IN_SHOP" },
        });
      }

      return newRecord;
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error("[Maintenance Log Create Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to create maintenance log" }, { status: 500 });
  }
}
