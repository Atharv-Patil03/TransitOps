import { prisma } from './lib/db';
import { createTrip, dispatchTrip, completeTrip, cancelTrip, getTrips, getTripDetails } from './actions/trips';
import { startMaintenance, finishMaintenance, getMaintenance } from './actions/maintenance';
import { DriverStatus, VehicleStatus, TripStatus } from './lib/validators/trips';
import { MaintenanceStatus } from './lib/validators/maintenance';

async function assertThrows(fn: () => Promise<any>, expectedMessagePart: string) {
  try {
    await fn();
    console.error(`❌ Expected error containing "${expectedMessagePart}" but function succeeded.`);
    process.exit(1);
  } catch (error: any) {
    if (error.message && error.message.includes(expectedMessagePart)) {
      console.log(`✅ Correctly failed: ${error.message}`);
    } else {
      console.error(`❌ Function failed but with unexpected error: ${error.message} (Expected: "${expectedMessagePart}")`);
      process.exit(1);
    }
  }
}

async function runTests() {
  console.log('--- Cleaning up database ---');
  await prisma.trip.deleteMany({});
  await prisma.maintenance.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.driver.deleteMany({});

  console.log('\n--- Seeding Initial Data ---');
  
  // Create Vehicles
  const heavyTruck = await prisma.vehicle.create({
    data: { capacity: 15000, status: VehicleStatus.AVAILABLE },
  });
  const lightTruck = await prisma.vehicle.create({
    data: { capacity: 3000, status: VehicleStatus.AVAILABLE },
  });
  console.log(`Created vehicles: Heavy (${heavyTruck.id}), Light (${lightTruck.id})`);

  // Create Drivers
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const goodDriver = await prisma.driver.create({
    data: { licenseExpiry: nextYear, status: DriverStatus.AVAILABLE },
  });
  const expiredDriver = await prisma.driver.create({
    data: { licenseExpiry: yesterday, status: DriverStatus.AVAILABLE },
  });
  console.log(`Created drivers: Good (${goodDriver.id}), Expired (${expiredDriver.id})`);

  console.log('\n--- Testing Validation & Business Rules ---');

  // Test 1: Cargo weight exceeds capacity
  console.log('Test 1: Verification that cargo weight exceeding capacity throws error...');
  await assertThrows(
    () => createTrip({
      source: 'Warehouse A',
      destination: 'Store B',
      cargoDesc: 'Heavy steel beams',
      cargoWeight: 4000, // exceeds lightTruck capacity of 3000
      plannedDist: 100,
      departureDate: new Date(),
      expectedArrival: tomorrow,
      vehicleId: lightTruck.id,
      driverId: goodDriver.id,
    }),
    'Cargo weight exceeds vehicle capacity'
  );

  // Test 2: Invalid Date order
  console.log('Test 2: Verification that expected arrival before departure date throws error...');
  await assertThrows(
    () => createTrip({
      source: 'Warehouse A',
      destination: 'Store B',
      cargoDesc: 'Apples',
      cargoWeight: 2000,
      plannedDist: 100,
      departureDate: tomorrow,
      expectedArrival: new Date(), // earlier than departure
      vehicleId: lightTruck.id,
      driverId: goodDriver.id,
    }),
    'Expected arrival date must be after departure date'
  );

  // Test 3: Driver license expired
  console.log('Test 3: Verification that creating a trip with an expired driver license throws error...');
  await assertThrows(
    () => createTrip({
      source: 'Warehouse A',
      destination: 'Store B',
      cargoDesc: 'Bananas',
      cargoWeight: 2000,
      plannedDist: 100,
      departureDate: new Date(),
      expectedArrival: tomorrow,
      vehicleId: lightTruck.id,
      driverId: expiredDriver.id,
    }),
    'Driver license has expired'
  );

  // Test 4: Successful Trip Creation
  console.log('Test 4: Creating a valid trip...');
  const trip1 = await createTrip({
    source: 'Seattle',
    destination: 'Portland',
    cargoDesc: 'Electronics',
    cargoWeight: 8000,
    plannedDist: 180,
    departureDate: new Date(),
    expectedArrival: tomorrow,
    vehicleId: heavyTruck.id,
    driverId: goodDriver.id,
  });
  console.log(`✅ Trip successfully created: ID ${trip1.id}, Status: ${trip1.status}`);

  console.log('\n--- Testing Dispatch Flow ---');
  
  // Test 5: Dispatch the trip
  console.log('Test 5: Dispatching the trip...');
  const dispatchedTrip = await dispatchTrip(trip1.id);
  console.log(`✅ Trip dispatched. Status: ${dispatchedTrip.status}`);

  // Verify Vehicle & Driver statuses updated to ON_TRIP
  const checkVehicleOnTrip = await prisma.vehicle.findUnique({ where: { id: heavyTruck.id } });
  const checkDriverOnTrip = await prisma.driver.findUnique({ where: { id: goodDriver.id } });
  if (checkVehicleOnTrip?.status !== VehicleStatus.ON_TRIP || checkDriverOnTrip?.status !== DriverStatus.ON_TRIP) {
    console.error('❌ Vehicle/Driver status not updated to ON_TRIP!');
    process.exit(1);
  }
  console.log('✅ Vehicle and Driver status verified as ON_TRIP');

  // Test 6: Try starting maintenance on a vehicle that is ON_TRIP
  console.log('Test 6: Verifying that initiating maintenance on an active vehicle fails...');
  await assertThrows(
    () => startMaintenance({
      vehicleId: heavyTruck.id,
      garage: 'Super Repairs',
      description: 'Oil leak fix',
      startDate: new Date(),
    }),
    'Vehicle is not AVAILABLE for maintenance'
  );

  console.log('\n--- Testing Completion Flow ---');

  // Test 7: Complete the trip
  console.log('Test 7: Completing the trip with metrics...');
  const completedTrip = await completeTrip(trip1.id, {
    actualDist: 185.5,
    finalOdometer: 104200.5,
    fuelUsed: 32.4,
  });
  console.log(`✅ Trip completed. Actual Distance: ${completedTrip.actualDist}, Fuel: ${completedTrip.fuelUsed}`);

  // Verify Vehicle & Driver statuses reset to AVAILABLE
  const checkVehicleAvailable = await prisma.vehicle.findUnique({ where: { id: heavyTruck.id } });
  const checkDriverAvailable = await prisma.driver.findUnique({ where: { id: goodDriver.id } });
  if (checkVehicleAvailable?.status !== VehicleStatus.AVAILABLE || checkDriverAvailable?.status !== DriverStatus.AVAILABLE) {
    console.error('❌ Vehicle/Driver status not reset to AVAILABLE!');
    process.exit(1);
  }
  console.log('✅ Vehicle and Driver status verified as AVAILABLE');

  console.log('\n--- Testing Cancel Flow ---');

  // Test 8: Create and cancel a trip
  console.log('Test 8: Creating and canceling a trip...');
  const trip2 = await createTrip({
    source: 'Portland',
    destination: 'Seattle',
    cargoDesc: 'Fresh Produce',
    cargoWeight: 5000,
    plannedDist: 180,
    departureDate: new Date(),
    expectedArrival: tomorrow,
    vehicleId: heavyTruck.id,
    driverId: goodDriver.id,
  });

  const cancelledTrip = await cancelTrip(trip2.id);
  console.log(`✅ Trip cancelled. Status: ${cancelledTrip.status}`);

  console.log('\n--- Testing Maintenance Flow ---');

  // Test 9: Start Maintenance
  console.log('Test 9: Starting maintenance on heavy truck...');
  const maint = await startMaintenance({
    vehicleId: heavyTruck.id,
    garage: 'Downtown Garage',
    description: 'Brake pads replacement',
    startDate: new Date(),
  });
  console.log(`✅ Maintenance started. ID: ${maint.id}, Status: ${maint.status}`);

  // Verify Vehicle status updated to IN_SHOP
  const checkVehicleInShop = await prisma.vehicle.findUnique({ where: { id: heavyTruck.id } });
  if (checkVehicleInShop?.status !== VehicleStatus.IN_SHOP) {
    console.error('❌ Vehicle status not set to IN_SHOP!');
    process.exit(1);
  }
  console.log('✅ Vehicle status verified as IN_SHOP');

  // Test 10: Try to dispatch a trip using vehicle in shop
  console.log('Test 10: Verifying that creating a trip with vehicle in shop fails...');
  await assertThrows(
    () => createTrip({
      source: 'Tacoma',
      destination: 'Olympia',
      cargoDesc: 'Gravel',
      cargoWeight: 1000,
      plannedDist: 30,
      departureDate: new Date(),
      expectedArrival: tomorrow,
      vehicleId: heavyTruck.id, // IN_SHOP
      driverId: goodDriver.id,
    }),
    'Vehicle must be AVAILABLE'
  );

  // Test 11: Finish Maintenance
  console.log('Test 11: Finishing maintenance...');
  const completedMaint = await finishMaintenance(maint.id, {
    cost: 450.75,
    endDate: tomorrow,
  });
  console.log(`✅ Maintenance finished. Cost: ${completedMaint.cost}, Status: ${completedMaint.status}`);

  // Verify Vehicle status reset to AVAILABLE
  const checkVehicleAfterMaint = await prisma.vehicle.findUnique({ where: { id: heavyTruck.id } });
  if (checkVehicleAfterMaint?.status !== VehicleStatus.AVAILABLE) {
    console.error('❌ Vehicle status not reset to AVAILABLE after maintenance!');
    process.exit(1);
  }
  console.log('✅ Vehicle status verified as AVAILABLE');

  console.log('\n--- Testing Read Queries ---');

  // Test 12: Read getTrips
  console.log('Test 12: Fetching trips with search filter "Electronics"...');
  const tripsResult = await getTrips({ search: 'Electronics' });
  if (tripsResult.trips.length !== 1) {
    console.error(`❌ Expected 1 trip, got ${tripsResult.trips.length}`);
    process.exit(1);
  }
  console.log(`✅ Successfully retrieved ${tripsResult.trips.length} trip using search filter`);

  // Test 13: Read getTripDetails
  console.log('Test 13: Fetching detailed trip record...');
  const tripDetails = await getTripDetails(trip1.id);
  if (!tripDetails.vehicle || !tripDetails.driver) {
    console.error('❌ Relational includes failed for getTripDetails!');
    process.exit(1);
  }
  console.log(`✅ Trip details fetched successfully with related Vehicle and Driver loaded`);

  // Test 14: Read getMaintenance
  console.log('Test 14: Fetching maintenance with status COMPLETED...');
  const maintResult = await getMaintenance({ status: MaintenanceStatus.COMPLETED });
  if (maintResult.maintenances.length !== 1) {
    console.error(`❌ Expected 1 maintenance record, got ${maintResult.maintenances.length}`);
    process.exit(1);
  }
  console.log(`✅ Successfully retrieved ${maintResult.maintenances.length} maintenance record by status filter`);

  console.log('\n=======================================');
  console.log('🎉 ALL BACKEND BUSINESS FLOW TESTS PASSED! 🎉');
  console.log('=======================================');
}

runTests().catch((err) => {
  console.error('❌ Unhandled test failure:', err);
  process.exit(1);
});
