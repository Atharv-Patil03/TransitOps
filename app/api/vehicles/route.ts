import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { trips: true },
      orderBy: { number: "asc" },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { number, type, capacity } = body;

    if (!number || !type || !capacity) {
      return NextResponse.json(
        { error: "number, type, capacity are required" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: { number, type, capacity: Number(capacity) },
    });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Vehicle number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
