import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        route: true,
        vehicle: true,
        bookings: true,
      },
      orderBy: { departureAt: "asc" },
    });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { routeId, vehicleId, departureAt, arrivalAt, status } = body;

    if (!routeId || !vehicleId || !departureAt || !arrivalAt) {
      return NextResponse.json(
        { error: "routeId, vehicleId, departureAt, arrivalAt are required" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        routeId,
        vehicleId,
        departureAt: new Date(departureAt),
        arrivalAt: new Date(arrivalAt),
        status: status ?? "SCHEDULED",
      },
      include: { route: true, vehicle: true },
    });
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
