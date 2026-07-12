import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        trip: { include: { route: true, vehicle: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tripId, seats } = body;

    if (!userId || !tripId) {
      return NextResponse.json(
        { error: "userId and tripId are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        tripId,
        seats: seats ?? 1,
        status: "CONFIRMED",
      },
      include: {
        user: true,
        trip: { include: { route: true } },
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
