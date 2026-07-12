import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalRoutes,
      totalTrips,
      totalBookings,
      totalVehicles,
      activeTrips,
      recentBookings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.route.count(),
      prisma.trip.count(),
      prisma.booking.count(),
      prisma.vehicle.count(),
      prisma.trip.count({ where: { status: "IN_PROGRESS" } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          trip: { include: { route: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalRoutes,
      totalTrips,
      totalBookings,
      totalVehicles,
      activeTrips,
      recentBookings,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
