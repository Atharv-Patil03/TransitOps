import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      availableVehicles,
      totalDrivers,
      activeDrivers,
      totalTrips,
      activeTrips,
      pendingTrips,
      completedTrips,
      totalBookings,
      recentBookings,
      fuelSum,
      maintenanceSum,
      expenseSum,
      tripsWithRevenue,
      vehiclesForRoi,
    ] = await Promise.all([
      // Users & Roles
      prisma.user.count(),
      // Vehicle Status KPIs
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
      prisma.vehicle.count({ where: { status: "IN_SHOP" } }),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      // Drivers
      prisma.driver.count(),
      prisma.driver.count({ where: { status: "ON_TRIP" } }),
      // Trips
      prisma.trip.count(),
      prisma.trip.count({ where: { status: "DISPATCHED" } }),
      prisma.trip.count({ where: { status: "DRAFT" } }),
      prisma.trip.count({ where: { status: "COMPLETED" } }),
      // Bookings
      prisma.booking.count(),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          trip: { include: { route: true } },
        },
      }),
      // Financial Totals
      prisma.fuelLog.aggregate({
        _sum: { liters: true, totalCost: true },
      }),
      prisma.maintenanceRecord.aggregate({
        _sum: { cost: true },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
      }),
      // Active Revenue from trips
      prisma.trip.aggregate({
        _sum: { revenue: true, cargoWeight: true, plannedDistance: true },
      }),
      // Fetch vehicles with acquisitions cost for ROI calculations
      prisma.vehicle.findMany({
        select: {
          id: true,
          number: true,
          model: true,
          acquisitionCost: true,
          status: true,
          fuelLogs: { select: { totalCost: true, liters: true } },
          maintenances: { select: { cost: true } },
          expenses: { select: { amount: true } },
          trips: { select: { revenue: true, plannedDistance: true } },
        },
      }),
    ]);

    // ── Calculate PDF Specific Metrics ──────────────────────────────────────

    // 1. Fleet Utilization (%)
    const fleetUtilization = totalVehicles > 0 
      ? ((activeVehicles / totalVehicles) * 100).toFixed(1) 
      : "0";

    // 2. Operational Cost (Fuel Cost + Maintenance Cost + General Expenses)
    const fuelCostTotal = fuelSum._sum.totalCost || 0;
    const maintenanceCostTotal = maintenanceSum._sum.cost || 0;
    const expenseCostTotal = expenseSum._sum.amount || 0;
    const totalOperationalCost = fuelCostTotal + maintenanceCostTotal + expenseCostTotal;

    // 3. Fuel Efficiency (Distance / Fuel Liters)
    const totalDistance = tripsWithRevenue._sum.plannedDistance || 0;
    const totalFuelLiters = fuelSum._sum.liters || 0;
    const fuelEfficiency = totalFuelLiters > 0 
      ? (totalDistance / totalFuelLiters).toFixed(2) 
      : "0";

    // 4. Vehicle ROI Breakdown
    const vehicleRoiList = vehiclesForRoi.map((v) => {
      const vFuel = v.fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
      const vMaintenance = v.maintenances.reduce((acc, m) => acc + m.cost, 0);
      const vExpenses = v.expenses.reduce((acc, e) => acc + e.amount, 0);
      const vRevenue = v.trips.reduce((acc, t) => acc + t.revenue, 0);
      
      const netProfit = vRevenue - (vFuel + vMaintenance + vExpenses);
      const roi = v.acquisitionCost > 0 
        ? ((netProfit / v.acquisitionCost) * 100).toFixed(2)
        : "0.00";

      return {
        id: v.id,
        number: v.number,
        model: v.model,
        status: v.status,
        revenue: vRevenue,
        operationalCost: vFuel + vMaintenance + vExpenses,
        netProfit,
        roi: `${roi}%`,
      };
    });

    return NextResponse.json({
      // Base stats
      totalUsers,
      totalDrivers,
      activeDrivers,
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      availableVehicles,
      totalTrips,
      activeTrips,
      pendingTrips,
      completedTrips,
      totalBookings,
      recentBookings,
      
      // PDF specific metrics
      fleetUtilization: Number(fleetUtilization),
      totalOperationalCost,
      fuelEfficiency: Number(fuelEfficiency),
      vehicleRoi: vehicleRoiList,
    });
  } catch (error: any) {
    console.error("[Stats API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
