import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.maintenanceRecord.findUnique({
      where: { id },
      include: { vehicle: true },
    });
    if (!record) {
      return NextResponse.json({ error: "Maintenance log not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch maintenance log" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, nextDueAt, technician } = body;

    const existingRecord = await prisma.maintenanceRecord.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Maintenance log not found" }, { status: 404 });
    }

    const previousStatus = existingRecord.status;

    // "Closing maintenance restores the vehicle to Available (unless retired)."
    let restoreVehicle = false;
    if (
      status === "COMPLETED" &&
      previousStatus !== "COMPLETED" &&
      existingRecord.vehicle.status !== "RETIRED"
    ) {
      restoreVehicle = true;
    }

    const updatedRecord = await prisma.$transaction(async (tx) => {
      const record = await tx.maintenanceRecord.update({
        where: { id },
        data: {
          status,
          nextDueAt: nextDueAt ? new Date(nextDueAt) : undefined,
          technician: technician || undefined,
        },
      });

      if (restoreVehicle) {
        await tx.vehicle.update({
          where: { id: record.vehicleId },
          data: { status: "AVAILABLE" },
        });
      }

      return record;
    });

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    console.error("[Maintenance Log Update Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to update maintenance log" }, { status: 500 });
  }
}
