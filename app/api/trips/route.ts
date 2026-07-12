import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        route: true,
        vehicle: true,
        driver: { include: { user: true } },
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
    const { routeId, vehicleId, driverId, departureAt, arrivalAt, status, cargoWeight, plannedDistance, revenue } = body;

    if (!routeId || !vehicleId || !departureAt || !arrivalAt) {
      return NextResponse.json(
        { error: "routeId, vehicleId, departureAt, arrivalAt are required" },
        { status: 400 }
      );
    }

    // ── Business Rules Validations ──────────────────────────────────────────

    // 1. Fetch Vehicle and check eligibility
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    // "Retired or In Shop vehicles must never appear in the dispatch selection."
    if (vehicle.status === "RETIRED" || vehicle.status === "IN_SHOP") {
      return NextResponse.json({ error: "Vehicle is in maintenance (In Shop) or retired" }, { status: 400 });
    }
    // "A driver or vehicle already marked On Trip cannot be assigned to another trip."
    if (vehicle.status === "ON_TRIP") {
      return NextResponse.json({ error: "Vehicle is already assigned to an active trip (On Trip)" }, { status: 400 });
    }
    // "Cargo Weight must not exceed the vehicle's maximum load capacity."
    if (cargoWeight && Number(cargoWeight) > vehicle.capacity) {
      return NextResponse.json({
        error: `Cargo weight (${cargoWeight}kg) exceeds vehicle capacity limit (${vehicle.capacity}kg)`
      }, { status: 400 });
    }

    // 2. Fetch Driver and check eligibility
    let driver = null;
    if (driverId) {
      driver = await prisma.driver.findUnique({ where: { id: driverId } });
      if (!driver) {
        return NextResponse.json({ error: "Driver not found" }, { status: 404 });
      }
      // "A driver or vehicle already marked On Trip cannot be assigned to another trip."
      if (driver.status === "ON_TRIP") {
        return NextResponse.json({ error: "Driver is already on a trip" }, { status: 400 });
      }
      // "Drivers with expired licenses or Suspended status cannot be assigned to trips."
      if (driver.status === "SUSPENDED") {
        return NextResponse.json({ error: "Driver license status is Suspended" }, { status: 400 });
      }
      if (new Date(driver.licenseExpiry) < new Date()) {
        return NextResponse.json({ error: "Driver driving license is expired" }, { status: 400 });
      }
    }

    // 3. Create the Trip and apply status changes
    const trip = await prisma.$transaction(async (tx) => {
      const isDispatched = status === "DISPATCHED";

      const newTrip = await tx.trip.create({
        data: {
          routeId,
          vehicleId,
          driverId,
          departureAt: new Date(departureAt),
          arrivalAt: new Date(arrivalAt),
          status: status ?? "DRAFT",
          cargoWeight: cargoWeight ? Number(cargoWeight) : 0,
          plannedDistance: plannedDistance ? Number(plannedDistance) : 0,
          revenue: revenue ? Number(revenue) : 0,
        },
        include: { route: true, vehicle: true, driver: { include: { user: true } } },
      });

      // "Dispatching a trip automatically changes both the vehicle and driver status to On Trip."
      if (isDispatched) {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: "ON_TRIP" },
        });

        if (driverId) {
          await tx.driver.update({
            where: { id: driverId },
            data: { status: "ON_TRIP" },
          });
        }
      }

      return newTrip;
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error("[Trip Create API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to create trip" }, { status: 500 });
  }
}
