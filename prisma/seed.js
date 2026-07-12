/**
 * TransitOps Fleet Management — Hackathon Compliant Seed Script
 * Run: node prisma/seed.js
 */

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function hash(pw) {
  return bcrypt.hash(pw, 12);
}

async function main() {
  console.log("🌱 Seeding TransitOps database with Hackathon compliant data...\n");

  // ── 1. USERS ──────────────────────────────────────────────────────────────

  const usersData = [
    // System admin
    { name: "System Admin",      email: "admin@transitops.com",    password: "Admin@1234",   role: "ADMIN" },
    // Fleet Manager
    { name: "Rajesh Sharma",     email: "fleet@transitops.com",    password: "Fleet@1234",   role: "FLEET_MANAGER" },
    // Driver users
    { name: "Arjun Mehta",       email: "arjun@transitops.com",    password: "Driver@1234",  role: "DRIVER" },
    { name: "Priya Nair",        email: "priya@transitops.com",    password: "Driver@1234",  role: "DRIVER" },
    { name: "Suresh Kumar",      email: "suresh@transitops.com",   password: "Driver@1234",  role: "DRIVER" },
    { name: "Kavya Reddy",       email: "kavya@transitops.com",    password: "Driver@1234",  role: "DRIVER" },
    { name: "Mohan Verma",       email: "mohan@transitops.com",    password: "Driver@1234",  role: "DRIVER" },
    // Safety Officer
    { name: "Anita Desai",       email: "safety@transitops.com",   password: "Safety@1234",  role: "SAFETY_OFFICER" },
    // Financial Analyst
    { name: "Vikram Patel",      email: "finance@transitops.com",  password: "Finance@1234", role: "FINANCIAL_ANALYST" },
  ];

  const createdUsers = {};
  for (const u of usersData) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      createdUsers[u.email] = existing;
      console.log(`  ⚠️  User ${u.email} already exists — skipping`);
      continue;
    }
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email, password: await hash(u.password), role: u.role },
    });
    createdUsers[u.email] = user;
    console.log(`  ✅ User: ${u.name} (${u.role})`);
  }

  // ── 2. VEHICLES ───────────────────────────────────────────────────────────

  const vehiclesData = [
    { number: "VH-001", licensePlate: "MH-01-AB-1001", make: "Tata",    model: "Starbus Ultra",  year: 2022, type: "BUS",     capacity: 12000, status: "AVAILABLE", odometer: 45230, acquisitionCost: 2800000, fuelType: "DIESEL" },
    { number: "VH-002", licensePlate: "MH-01-AB-1002", make: "Ashok",   model: "Leyland Viking", year: 2021, type: "BUS",     capacity: 15000, status: "AVAILABLE", odometer: 62100, acquisitionCost: 3200000, fuelType: "DIESEL" },
    { number: "VH-003", licensePlate: "MH-01-AB-1003", make: "Force",   model: "Traveller 3700", year: 2023, type: "MINIBUS", capacity: 4000,  status: "IN_SHOP",   odometer: 18500, acquisitionCost: 1400000, fuelType: "DIESEL" },
    { number: "VH-004", licensePlate: "MH-01-AB-1004", make: "Tata",    model: "Winger",         year: 2020, type: "VAN",     capacity: 2500,  status: "AVAILABLE", odometer: 78900, acquisitionCost: 950000,  fuelType: "PETROL" },
    { number: "VH-005", licensePlate: "MH-01-AB-1005", make: "BYD",     model: "K9",             year: 2024, type: "BUS",     capacity: 18000, status: "AVAILABLE", odometer: 5200,  acquisitionCost: 4500000, fuelType: "ELECTRIC" },
  ];

  const createdVehicles = {};
  for (const v of vehiclesData) {
    const existing = await prisma.vehicle.findUnique({ where: { number: v.number } });
    if (existing) {
      createdVehicles[v.number] = existing;
      console.log(`  ⚠️  Vehicle ${v.number} already exists — skipping`);
      continue;
    }
    const vehicle = await prisma.vehicle.create({ data: v });
    createdVehicles[v.number] = vehicle;
    console.log(`  ✅ Vehicle: ${v.number} — ${v.make} ${v.model} (Max Load: ${v.capacity}kg, Cost: ₹${v.acquisitionCost})`);
  }

  // ── 3. DRIVERS ────────────────────────────────────────────────────────────

  const driverEmails = [
    "arjun@transitops.com",
    "priya@transitops.com",
    "suresh@transitops.com",
    "kavya@transitops.com",
    "mohan@transitops.com",
  ];

  const vehicleNumbers = ["VH-001", "VH-002", "VH-003", "VH-004", "VH-005"];

  const driverMeta = [
    { license: "DL-MH-2019-001234", category: "Heavy Goods",   expiry: new Date("2027-06-30"), contact: "+91 98765 43210", score: 98, status: "AVAILABLE" },
    { license: "DL-MH-2020-005678", category: "Heavy Passenger", expiry: new Date("2026-12-31"), contact: "+91 98765 43211", score: 95, status: "ON_TRIP" },
    { license: "DL-MH-2018-009012", category: "Medium Goods",  expiry: new Date("2028-03-15"), contact: "+91 98765 43212", score: 88, status: "AVAILABLE" },
    { license: "DL-MH-2021-003456", category: "Light Goods",   expiry: new Date("2027-09-20"), contact: "+91 98765 43213", score: 92, status: "OFF_DUTY" },
    { license: "DL-MH-2022-007890", category: "Heavy Passenger", expiry: new Date("2026-08-10"), contact: "+91 98765 43214", score: 79, status: "AVAILABLE" },
  ];

  const createdDrivers = [];
  for (let i = 0; i < driverEmails.length; i++) {
    const user = createdUsers[driverEmails[i]];
    const vehicle = createdVehicles[vehicleNumbers[i]];
    const meta = driverMeta[i];

    if (!user) continue;

    const existing = await prisma.driver.findUnique({ where: { userId: user.id } });
    if (existing) {
      createdDrivers.push(existing);
      console.log(`  ⚠️  Driver for ${user.name} already exists — skipping`);
      continue;
    }

    const driver = await prisma.driver.create({
      data: {
        userId: user.id,
        vehicleId: vehicle?.id,
        licenseNumber: meta.license,
        licenseCategory: meta.category,
        licenseExpiry: meta.expiry,
        contactNumber: meta.contact,
        safetyScore: meta.score,
        totalTrips: 12 + i * 4,
        status: meta.status,
      },
    });
    createdDrivers.push(driver);
    console.log(`  ✅ Driver: ${user.name} (License: ${meta.category}, Safety Score: ${meta.score})`);
  }

  // ── 4. ROUTES ─────────────────────────────────────────────────────────────

  const createdRoutes = [];
  const routeCount = await prisma.route.count();
  if (routeCount === 0) {
    const r1 = await prisma.route.create({ data: { name: "City Central Express", origin: "Central Station", destination: "Airport Terminal", distance: 28.5 } });
    const r2 = await prisma.route.create({ data: { name: "North-South Corridor", origin: "North Hub", destination: "South Terminal", distance: 42.0 } });
    const r3 = await prisma.route.create({ data: { name: "Industrial Link", origin: "City Center", destination: "Industrial Zone", distance: 15.2 } });
    createdRoutes.push(r1, r2, r3);
    console.log("  ✅ Routes seeded (3 routes)");
  } else {
    const existingRoutes = await prisma.route.findMany();
    createdRoutes.push(...existingRoutes);
  }

  // ── 5. TRIPS (HACKATHON LIFECYCLE) ────────────────────────────────────────

  const tripCount = await prisma.trip.count();
  if (tripCount === 0 && createdRoutes.length > 0 && createdDrivers.length > 0) {
    const vh1 = createdVehicles["VH-001"];
    const vh2 = createdVehicles["VH-002"];
    const dr1 = createdDrivers[0];
    const dr2 = createdDrivers[1];
    
    await prisma.trip.createMany({
      data: [
        {
          routeId: createdRoutes[0].id,
          vehicleId: vh1.id,
          driverId: dr1.id,
          departureAt: new Date("2026-07-12T08:00:00Z"),
          arrivalAt: new Date("2026-07-12T10:30:00Z"),
          status: "COMPLETED",
          cargoWeight: 450,
          plannedDistance: 28.5,
          revenue: 12500,
          notes: "On-time arrival at Airport cargo bay"
        },
        {
          routeId: createdRoutes[1].id,
          vehicleId: vh2.id,
          driverId: dr2.id,
          departureAt: new Date("2026-07-12T09:30:00Z"),
          arrivalAt: new Date("2026-07-12T12:00:00Z"),
          status: "DISPATCHED",
          cargoWeight: 1200,
          plannedDistance: 42.0,
          revenue: 18000,
          notes: "Heavy transport dispatched and tracking"
        }
      ]
    });
    console.log("  ✅ Trips seeded (1 Completed, 1 Dispatched)");
  }

  // ── 6. MAINTENANCE RECORDS ────────────────────────────────────────────────

  const maintenanceCount = await prisma.maintenanceRecord.count();
  if (maintenanceCount === 0) {
    const vh1 = createdVehicles["VH-001"];
    const vh3 = createdVehicles["VH-003"];
    if (vh1 && vh3) {
      await prisma.maintenanceRecord.createMany({
        data: [
          { vehicleId: vh1.id, type: "OIL_CHANGE",   description: "Engine oil and filter replacement", cost: 3500,  performedAt: new Date("2026-06-15"), nextDueAt: new Date("2026-12-15"), mileageAt: 44000, technician: "Ravi Auto Works",    status: "COMPLETED" },
          { vehicleId: vh1.id, type: "TIRE_ROTATION", description: "All 6 tyres rotated and balanced",  cost: 1800,  performedAt: new Date("2026-05-10"), mileageAt: 42000, technician: "SpeedFit Tyres",      status: "COMPLETED" },
          { vehicleId: vh3.id, type: "ENGINE_REPAIR",  description: "Fuel injector cleaning + turbo check", cost: 12000, performedAt: new Date("2026-07-10"), mileageAt: 18400, technician: "Force Service Center", status: "IN_PROGRESS" },
        ],
      });
      console.log("  ✅ Maintenance records seeded");
    }
  }

  // ── 7. FUEL LOGS ──────────────────────────────────────────────────────────

  const fuelCount = await prisma.fuelLog.count();
  if (fuelCount === 0) {
    const vh1 = createdVehicles["VH-001"];
    const vh2 = createdVehicles["VH-002"];
    if (vh1 && vh2) {
      await prisma.fuelLog.createMany({
        data: [
          { vehicleId: vh1.id, liters: 120, costPerLiter: 95.5, totalCost: 11460, mileageAt: 45000, station: "HP Pump - Andheri",    loggedAt: new Date("2026-07-10") },
          { vehicleId: vh1.id, liters: 95,  costPerLiter: 95.5, totalCost: 9072,  mileageAt: 44500, station: "Indian Oil - Kurla",  loggedAt: new Date("2026-07-05") },
          { vehicleId: vh2.id, liters: 110, costPerLiter: 95.0, totalCost: 10450, mileageAt: 62000, station: "BPCL - Thane West",   loggedAt: new Date("2026-07-09") },
        ],
      });
      console.log("  ✅ Fuel logs seeded");
    }
  }

  // ── 8. EXPENSES (Tolls, permits, etc.) ────────────────────────────────────

  const expenseCount = await prisma.expense.count();
  if (expenseCount === 0) {
    const vh1 = createdVehicles["VH-001"];
    const vh2 = createdVehicles["VH-002"];
    if (vh1 && vh2) {
      await prisma.expense.createMany({
        data: [
          { vehicleId: vh1.id, type: "TOLL",   amount: 850,  description: "Expressway toll charges", date: new Date("2026-07-10") },
          { vehicleId: vh1.id, type: "PERMIT", amount: 1500, description: "State border permit",       date: new Date("2026-07-05") },
          { vehicleId: vh2.id, type: "TOLL",   amount: 920,  description: "NH-8 Expressway toll charges", date: new Date("2026-07-09") },
        ],
      });
      console.log("  ✅ Expense records seeded");
    }
  }

  console.log("\n✨ Hackathon Seed complete!\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
