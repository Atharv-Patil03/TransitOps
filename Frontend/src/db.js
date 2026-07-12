// ============================================================
// TRANSITOPS — LOCAL PERSISTENCE STORAGE ENGINE
// Client-side Database Layer enforcing Business Validation Rules
// ============================================================

const DB = {
  // ── Vehicles CRUD ──
  getVehicles() {
    const data = localStorage.getItem('transitops_vehicles');
    if (!data) {
      // Map initial mock data objects if first run
      const initial = [
        { id: 'VH-001', plate: 'TRK-4821', name: 'Volvo FH16', type: 'Heavy Truck', capacity: 18000, odometer: 124500, cost: 145000, status: 'On Trip' },
        { id: 'VH-002', plate: 'VAN-1293', name: 'Ford Transit', type: 'Van', capacity: 3500, odometer: 84200, cost: 42000, status: 'On Trip' },
        { id: 'VH-003', plate: 'TRK-7734', name: 'Scania R500', type: 'Heavy Truck', capacity: 20000, odometer: 156800, cost: 165000, status: 'In Shop' },
        { id: 'VH-004', plate: 'SDN-5567', name: 'Tesla Model S', type: 'Electric', capacity: 500, odometer: 24500, cost: 85000, status: 'On Trip' },
        { id: 'VH-005', plate: 'EV-0891', name: 'Mercedes eActros', type: 'Electric', capacity: 12000, odometer: 12300, cost: 195000, status: 'Available' },
        { id: 'VH-006', plate: 'TRK-3312', name: 'Isuzu NPR', type: 'Light Truck', capacity: 5000, odometer: 98100, cost: 65000, status: 'Available' },
        { id: 'VH-007', plate: 'VAN-8845', name: 'Ram ProMaster', type: 'Van', capacity: 4000, odometer: 67300, cost: 48000, status: 'Available' },
        { id: 'VH-008', plate: 'TRK-2201', name: 'Volvo FMX', type: 'Heavy Truck', capacity: 22000, odometer: 189000, cost: 155000, status: 'Available' }
      ];
      localStorage.setItem('transitops_vehicles', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveVehicles(list) {
    localStorage.setItem('transitops_vehicles', JSON.stringify(list));
  },

  addVehicle(vehicle) {
    const list = this.getVehicles();
    // Validate uniqueness of registration number
    const exists = list.some(v => v.plate.toUpperCase().trim() === vehicle.plate.toUpperCase().trim());
    if (exists) {
      throw new Error(`Registration Number "${vehicle.plate}" already exists in registry.`);
    }
    list.unshift(vehicle);
    this.saveVehicles(list);
    return vehicle;
  },

  updateVehicleStatus(plate, status) {
    const list = this.getVehicles();
    const index = list.findIndex(v => v.plate === plate);
    if (index !== -1) {
      list[index].status = status;
      this.saveVehicles(list);
    }
  },

  // ── Drivers CRUD ──
  getDrivers() {
    const data = localStorage.getItem('transitops_drivers');
    if (!data) {
      const initial = [
        { id: 'DRV-001', name: 'Marcus Chen', status: 'On Trip', rating: 4.9, trips: 124, onTime: 97.2, phone: '+1 (555) 234-5678', license: 'CDL-A', expiry: '2027-09-15', vehicle: 'TRK-4821', region: 'Northeast' },
        { id: 'DRV-002', name: 'Sarah Miller', status: 'On Trip', rating: 4.7, trips: 98, onTime: 95.8, phone: '+1 (555) 345-6789', license: 'CDL-B', expiry: '2028-06-20', vehicle: 'VAN-1293', region: 'West Coast' },
        { id: 'DRV-003', name: 'James Wilson', status: 'Available', rating: 4.8, trips: 145, onTime: 96.5, phone: '+1 (555) 456-7890', license: 'CDL-A', expiry: '2026-11-08', vehicle: '—', region: 'Midwest' },
        { id: 'DRV-004', name: 'Emily Davis', status: 'On Trip', rating: 4.6, trips: 87, onTime: 93.1, phone: '+1 (555) 567-8901', license: 'CDL-A', expiry: '2027-01-12', vehicle: 'SDN-5567', region: 'Southwest' },
        { id: 'DRV-005', name: 'Alex Nakamura', status: 'Available', rating: 4.9, trips: 65, onTime: 98.4, phone: '+1 (555) 678-9012', license: 'CDL-B', expiry: '2027-04-22', vehicle: '—', region: 'West Coast' },
        { id: 'DRV-006', name: 'Robert Brown', status: 'Suspended', rating: 4.3, trips: 110, onTime: 89.7, phone: '+1 (555) 789-0123', license: 'CDL-A', expiry: '2025-05-05', vehicle: '—', region: 'Southeast' }
      ];
      localStorage.setItem('transitops_drivers', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveDrivers(list) {
    localStorage.setItem('transitops_drivers', JSON.stringify(list));
  },

  addDriver(driver) {
    const list = this.getDrivers();
    list.unshift(driver);
    this.saveDrivers(list);
    return driver;
  },

  updateDriverStatus(name, status, vehicle = '—') {
    const list = this.getDrivers();
    const index = list.findIndex(d => d.name === name);
    if (index !== -1) {
      list[index].status = status;
      list[index].vehicle = vehicle;
      this.saveDrivers(list);
    }
  },

  // ── Trips CRUD ──
  getTrips() {
    const data = localStorage.getItem('transitops_trips');
    if (!data) {
      const initial = [
        { id: 'TRP-78432', route: 'New York → Boston', driver: 'Marcus Chen', driverAvatar: 'MC', vehicle: 'TRK-4821', status: 'delivered', distance: '215 mi', duration: '3h 42m', cost: '$312', rating: 5, date: '2026-07-12', time: '08:15 AM' },
        { id: 'TRP-78431', route: 'Los Angeles → San Diego', driver: 'Sarah Miller', driverAvatar: 'SM', vehicle: 'VAN-1293', status: 'in-transit', distance: '120 mi', duration: '1h 55m', cost: '$186', rating: 4, date: '2026-07-12', time: '09:30 AM' },
        { id: 'TRP-78430', route: 'Houston → Dallas', driver: 'Emily Davis', driverAvatar: 'ED', vehicle: 'SDN-5567', status: 'in-transit', distance: '239 mi', duration: '3h 28m', cost: '$295', rating: 4, date: '2026-07-12', time: '07:00 AM' }
      ];
      localStorage.setItem('transitops_trips', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveTrips(list) {
    localStorage.setItem('transitops_trips', JSON.stringify(list));
  },

  addTrip(trip) {
    // ── Mandatory Validation Rules ──
    const vehicles = this.getVehicles();
    const drivers = this.getDrivers();

    const v = vehicles.find(item => item.plate === trip.vehicle);
    const d = drivers.find(item => item.name === trip.driver);

    if (!v) throw new Error("Selected vehicle could not be found.");
    if (!d) throw new Error("Selected driver could not be found.");

    // Rule 1: Retired or In Shop vehicles must never appear in dispatch selection
    if (v.status === 'Retired' || v.status === 'In Shop') {
      throw new Error(`Vehicle ${trip.vehicle} is currently ${v.status} and cannot be dispatched.`);
    }

    // Rule 2: Drivers with expired licenses or Suspended status cannot be assigned to trips
    if (d.status === 'Suspended') {
      throw new Error(`Driver ${trip.driver} is Suspended and cannot be assigned to trips.`);
    }
    const today = new Date().toISOString().split('T')[0];
    if (d.expiry < today) {
      throw new Error(`Driver ${trip.driver} has an expired driving license (${d.expiry}) and cannot be assigned to trips.`);
    }

    // Rule 3: A driver or vehicle already marked On Trip cannot be assigned to another trip
    if (v.status === 'On Trip') {
      throw new Error(`Vehicle ${trip.vehicle} is currently dispatched On Trip.`);
    }
    if (d.status === 'On Trip') {
      throw new Error(`Driver ${trip.driver} is currently dispatched On Trip.`);
    }

    // Rule 4: Cargo Weight must not exceed the vehicle's maximum load capacity
    if (trip.weight > v.capacity) {
      throw new Error(`Cargo weight (${trip.weight} kg) exceeds vehicle max load capacity (${v.capacity} kg).`);
    }

    // Validation passes -> proceed
    const list = this.getTrips();
    list.unshift(trip);
    this.saveTrips(list);

    // Rule 5: Dispatching a trip automatically changes both vehicle and driver status to On Trip
    this.updateVehicleStatus(trip.vehicle, 'On Trip');
    this.updateDriverStatus(trip.driver, 'On Trip', trip.vehicle);

    return trip;
  },

  // ── Maintenance CRUD ──
  getMaintenance() {
    const data = localStorage.getItem('transitops_maintenance');
    if (!data) {
      const initial = [
        { id: 'MNT-4501', vehicle: 'TRK-4821', type: 'Oil Change', priority: 'medium', dueDate: '2026-07-15', estimatedCost: '$180', assignedTo: 'Bay 3', status: 'scheduled' },
        { id: 'MNT-4498', vehicle: 'TRK-7734', type: 'Transmission Repair', priority: 'critical', dueDate: '2026-07-12', estimatedCost: '$2,400', assignedTo: 'Bay 4', progress: 65, status: 'in-progress' }
      ];
      localStorage.setItem('transitops_maintenance', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveMaintenance(list) {
    localStorage.setItem('transitops_maintenance', JSON.stringify(list));
  },

  addMaintenanceLog(log) {
    const list = this.getMaintenance();
    list.unshift(log);
    this.saveMaintenance(list);

    // Rule: Creating an active maintenance record automatically changes vehicle status to In Shop
    this.updateVehicleStatus(log.vehicle, 'In Shop');
    return log;
  }
};
