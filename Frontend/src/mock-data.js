// ============================================================
// TRANSITOPS — MOCK DATA
// Comprehensive realistic data for all screens
// ============================================================

const MockData = {
  // ── Company Info ──
  company: {
    name: 'TransitOps',
    tagline: 'Smart Transport Operations',
    fleetSize: 1000,
    activeVehicles: 842,
    totalDrivers: 956,
    regions: ['North America', 'Europe', 'Asia Pacific']
  },

  // ── KPI Data (Section 3.2 Specification) ──
  kpis: {
    activeVehicles: { value: 842, total: 1000, delta: 3.2, trend: 'up', unit: '' },
    availableVehicles: { value: 140, delta: 1.2, trend: 'up', unit: '' },
    openMaintenance: { value: 18, delta: -2, trend: 'down', unit: 'units' },
    activeTrips: { value: 127, delta: 5.4, trend: 'up', unit: '' },
    pendingTrips: { value: 45, delta: -8, trend: 'down', unit: '' },
    driversOnDuty: { value: 680, delta: 2.1, trend: 'up', unit: '' },
    fleetUtilization: { value: 84.2, delta: 4.5, trend: 'up', unit: '%' }
  },

  // ── Revenue/Cost Trend (12 months) ──
  revenueTrend: [
    { month: 'Jan', revenue: 245000, cost: 189000 },
    { month: 'Feb', revenue: 258000, cost: 195000 },
    { month: 'Mar', revenue: 271000, cost: 201000 },
    { month: 'Apr', revenue: 263000, cost: 198000 },
    { month: 'May', revenue: 289000, cost: 210000 },
    { month: 'Jun', revenue: 305000, cost: 218000 },
    { month: 'Jul', revenue: 312000, cost: 224000 },
    { month: 'Aug', revenue: 298000, cost: 215000 },
    { month: 'Sep', revenue: 325000, cost: 230000 },
    { month: 'Oct', revenue: 341000, cost: 238000 },
    { month: 'Nov', revenue: 358000, cost: 245000 },
    { month: 'Dec', revenue: 372000, cost: 252000 }
  ],

  // ── Weekly Forecast ──
  weeklyForecast: [
    { day: 'Mon', trips: 142, target: 150 },
    { day: 'Tue', trips: 158, target: 150 },
    { day: 'Wed', trips: 135, target: 150 },
    { day: 'Thu', trips: 167, target: 150 },
    { day: 'Fri', trips: 189, target: 150 },
    { day: 'Sat', trips: 95, target: 100 },
    { day: 'Sun', trips: 72, target: 80 }
  ],

  // ── Fleet Composition ──
  fleetComposition: [
    { type: 'Heavy Trucks', count: 320, color: '#6C5CE7' },
    { type: 'Light Trucks', count: 245, color: '#8B7CF7' },
    { type: 'Vans', count: 198, color: '#2DD4BF' },
    { type: 'Sedans', count: 142, color: '#F5A623' },
    { type: 'Electric', count: 95, color: '#22C55E' }
  ],

  // ── Vehicles on Map ──
  vehicles: [
    { id: 'VH-001', plate: 'TRK-4821', driver: 'Marcus Chen', type: 'Heavy Truck', status: 'moving', lat: 40.7128, lng: -74.006, speed: 65, heading: 45, route: 'NYC → Boston', eta: '2h 15m', fuel: 72 },
    { id: 'VH-002', plate: 'VAN-1293', driver: 'Sarah Miller', type: 'Van', status: 'moving', lat: 34.0522, lng: -118.2437, speed: 55, heading: 120, route: 'LA → San Diego', eta: '1h 30m', fuel: 85 },
    { id: 'VH-003', plate: 'TRK-7734', driver: 'James Wilson', type: 'Heavy Truck', status: 'idle', lat: 41.8781, lng: -87.6298, speed: 0, heading: 0, route: 'Chicago Hub', eta: '—', fuel: 45 },
    { id: 'VH-004', plate: 'SDN-5567', driver: 'Emily Davis', type: 'Sedan', status: 'moving', lat: 29.7604, lng: -95.3698, speed: 72, heading: 200, route: 'Houston → Dallas', eta: '3h 45m', fuel: 63 },
    { id: 'VH-005', plate: 'EV-0891', driver: 'Alex Nakamura', type: 'Electric', status: 'moving', lat: 37.7749, lng: -122.4194, speed: 48, heading: 90, route: 'SF → Oakland', eta: '25m', fuel: 91 },
    { id: 'VH-006', plate: 'TRK-3312', driver: 'Robert Brown', type: 'Light Truck', status: 'alert', lat: 33.749, lng: -84.388, speed: 0, heading: 0, route: 'Atlanta → Miami', eta: 'Delayed', fuel: 12 },
    { id: 'VH-007', plate: 'VAN-8845', driver: 'Lisa Thompson', type: 'Van', status: 'moving', lat: 47.6062, lng: -122.3321, speed: 40, heading: 180, route: 'Seattle → Portland', eta: '2h 50m', fuel: 67 },
    { id: 'VH-008', plate: 'TRK-2201', driver: 'David Kim', type: 'Heavy Truck', status: 'idle', lat: 39.7392, lng: -104.9903, speed: 0, heading: 0, route: 'Denver Hub', eta: '—', fuel: 88 },
    { id: 'VH-009', plate: 'LTK-6654', driver: 'Maria Garcia', type: 'Light Truck', status: 'moving', lat: 25.7617, lng: -80.1918, speed: 58, heading: 310, route: 'Miami → Tampa', eta: '3h 20m', fuel: 54 },
    { id: 'VH-010', plate: 'EV-1122', driver: 'Chris Anderson', type: 'Electric', status: 'alert', lat: 42.3601, lng: -71.0589, speed: 0, heading: 0, route: 'Boston Hub', eta: 'Charging', fuel: 8 },
    { id: 'VH-011', plate: 'TRK-9901', driver: 'Jennifer Lee', type: 'Heavy Truck', status: 'moving', lat: 36.1627, lng: -86.7816, speed: 70, heading: 60, route: 'Nashville → Charlotte', eta: '5h 10m', fuel: 76 },
    { id: 'VH-012', plate: 'VAN-3345', driver: 'Michael Scott', type: 'Van', status: 'moving', lat: 38.9072, lng: -77.0369, speed: 35, heading: 280, route: 'DC → Baltimore', eta: '45m', fuel: 82 },
  ],

  // ── Sector Breakdown ──
  sectors: [
    { name: 'Northeast', active: 214, total: 250, efficiency: 92 },
    { name: 'Southeast', active: 186, total: 220, efficiency: 88 },
    { name: 'Midwest', active: 178, total: 210, efficiency: 91 },
    { name: 'Southwest', active: 145, total: 170, efficiency: 85 },
    { name: 'West Coast', active: 119, total: 150, efficiency: 94 }
  ],

  // ── Recent Trips ──
  trips: [
    { id: 'TRP-78432', route: 'New York → Boston', driver: 'Marcus Chen', driverAvatar: 'MC', vehicle: 'TRK-4821', status: 'delivered', distance: '215 mi', duration: '3h 42m', cost: '$312', rating: 5, date: '2026-07-12', time: '08:15 AM' },
    { id: 'TRP-78431', route: 'Los Angeles → San Diego', driver: 'Sarah Miller', driverAvatar: 'SM', vehicle: 'VAN-1293', status: 'in-transit', distance: '120 mi', duration: '1h 55m', cost: '$186', rating: 4, date: '2026-07-12', time: '09:30 AM' },
    { id: 'TRP-78430', route: 'Houston → Dallas', driver: 'Emily Davis', driverAvatar: 'ED', vehicle: 'SDN-5567', status: 'in-transit', distance: '239 mi', duration: '3h 28m', cost: '$295', rating: 4, date: '2026-07-12', time: '07:00 AM' },
    { id: 'TRP-78429', route: 'Atlanta → Miami', driver: 'Robert Brown', driverAvatar: 'RB', vehicle: 'TRK-3312', status: 'delayed', distance: '662 mi', duration: '10h 15m', cost: '$845', rating: 3, date: '2026-07-11', time: '06:00 PM' },
    { id: 'TRP-78428', route: 'SF → Oakland', driver: 'Alex Nakamura', driverAvatar: 'AN', vehicle: 'EV-0891', status: 'delivered', distance: '13 mi', duration: '28m', cost: '$42', rating: 5, date: '2026-07-12', time: '10:45 AM' },
    { id: 'TRP-78427', route: 'Seattle → Portland', driver: 'Lisa Thompson', driverAvatar: 'LT', vehicle: 'VAN-8845', status: 'in-transit', distance: '174 mi', duration: '2h 50m', cost: '$228', rating: 4, date: '2026-07-12', time: '11:00 AM' },
    { id: 'TRP-78426', route: 'Chicago → Detroit', driver: 'James Wilson', driverAvatar: 'JW', vehicle: 'TRK-7734', status: 'delivered', distance: '282 mi', duration: '4h 15m', cost: '$378', rating: 5, date: '2026-07-11', time: '04:30 AM' },
    { id: 'TRP-78425', route: 'Miami → Tampa', driver: 'Maria Garcia', driverAvatar: 'MG', vehicle: 'LTK-6654', status: 'in-transit', distance: '280 mi', duration: '3h 50m', cost: '$342', rating: 4, date: '2026-07-12', time: '06:15 AM' },
    { id: 'TRP-78424', route: 'DC → Baltimore', driver: 'Michael Scott', driverAvatar: 'MS', vehicle: 'VAN-3345', status: 'delivered', distance: '38 mi', duration: '48m', cost: '$68', rating: 5, date: '2026-07-12', time: '08:00 AM' },
    { id: 'TRP-78423', route: 'Denver → SLC', driver: 'David Kim', driverAvatar: 'DK', vehicle: 'TRK-2201', status: 'cancelled', distance: '525 mi', duration: '—', cost: '$0', rating: 0, date: '2026-07-11', time: '02:00 PM' },
    { id: 'TRP-78422', route: 'Nashville → Charlotte', driver: 'Jennifer Lee', driverAvatar: 'JL', vehicle: 'TRK-9901', status: 'in-transit', distance: '410 mi', duration: '5h 45m', cost: '$520', rating: 4, date: '2026-07-12', time: '05:30 AM' },
    { id: 'TRP-78421', route: 'Boston → Hartford', driver: 'Chris Anderson', driverAvatar: 'CA', vehicle: 'EV-1122', status: 'delayed', distance: '102 mi', duration: '2h 10m', cost: '$128', rating: 3, date: '2026-07-11', time: '03:45 PM' },
    { id: 'TRP-78420', route: 'Phoenix → Tucson', driver: 'Daniel Martinez', driverAvatar: 'DM', vehicle: 'LTK-4490', status: 'delivered', distance: '113 mi', duration: '1h 38m', cost: '$165', rating: 5, date: '2026-07-11', time: '09:00 AM' },
    { id: 'TRP-78419', route: 'Portland → Eugene', driver: 'Amy Watson', driverAvatar: 'AW', vehicle: 'VAN-7712', status: 'delivered', distance: '110 mi', duration: '1h 52m', cost: '$148', rating: 4, date: '2026-07-11', time: '07:30 AM' },
    { id: 'TRP-78418', route: 'Dallas → Austin', driver: 'Tom Richardson', driverAvatar: 'TR', vehicle: 'SDN-3388', status: 'delivered', distance: '195 mi', duration: '2h 55m', cost: '$256', rating: 5, date: '2026-07-10', time: '10:00 AM' },
  ],

  // ── Drivers ──
  drivers: [
    { id: 'DRV-001', name: 'Marcus Chen', avatar: 'MC', status: 'active', rating: 4.9, trips: 1247, onTime: 97.2, phone: '+1 (555) 234-5678', license: 'CDL-A', joined: '2022-03-15', vehicle: 'TRK-4821', region: 'Northeast' },
    { id: 'DRV-002', name: 'Sarah Miller', avatar: 'SM', status: 'active', rating: 4.7, trips: 983, onTime: 95.8, phone: '+1 (555) 345-6789', license: 'CDL-B', joined: '2022-06-20', vehicle: 'VAN-1293', region: 'West Coast' },
    { id: 'DRV-003', name: 'James Wilson', avatar: 'JW', status: 'off-duty', rating: 4.8, trips: 1456, onTime: 96.5, phone: '+1 (555) 456-7890', license: 'CDL-A', joined: '2021-11-08', vehicle: 'TRK-7734', region: 'Midwest' },
    { id: 'DRV-004', name: 'Emily Davis', avatar: 'ED', status: 'active', rating: 4.6, trips: 876, onTime: 93.1, phone: '+1 (555) 567-8901', license: 'Class C', joined: '2023-01-12', vehicle: 'SDN-5567', region: 'Southwest' },
    { id: 'DRV-005', name: 'Alex Nakamura', avatar: 'AN', status: 'active', rating: 4.9, trips: 654, onTime: 98.4, phone: '+1 (555) 678-9012', license: 'CDL-B', joined: '2023-04-22', vehicle: 'EV-0891', region: 'West Coast' },
    { id: 'DRV-006', name: 'Robert Brown', avatar: 'RB', status: 'on-break', rating: 4.3, trips: 1102, onTime: 89.7, phone: '+1 (555) 789-0123', license: 'CDL-A', joined: '2022-01-05', vehicle: 'TRK-3312', region: 'Southeast' },
    { id: 'DRV-007', name: 'Lisa Thompson', avatar: 'LT', status: 'active', rating: 4.8, trips: 1034, onTime: 96.8, phone: '+1 (555) 890-1234', license: 'CDL-B', joined: '2022-08-14', vehicle: 'VAN-8845', region: 'West Coast' },
    { id: 'DRV-008', name: 'David Kim', avatar: 'DK', status: 'off-duty', rating: 4.5, trips: 789, onTime: 92.3, phone: '+1 (555) 901-2345', license: 'CDL-A', joined: '2023-02-28', vehicle: 'TRK-2201', region: 'Midwest' },
    { id: 'DRV-009', name: 'Maria Garcia', avatar: 'MG', status: 'active', rating: 4.7, trips: 921, onTime: 95.1, phone: '+1 (555) 012-3456', license: 'CDL-B', joined: '2022-09-10', vehicle: 'LTK-6654', region: 'Southeast' },
    { id: 'DRV-010', name: 'Chris Anderson', avatar: 'CA', status: 'on-break', rating: 4.4, trips: 543, onTime: 91.6, phone: '+1 (555) 123-4567', license: 'CDL-B', joined: '2023-06-01', vehicle: 'EV-1122', region: 'Northeast' },
    { id: 'DRV-011', name: 'Jennifer Lee', avatar: 'JL', status: 'active', rating: 4.8, trips: 1189, onTime: 97.0, phone: '+1 (555) 234-5679', license: 'CDL-A', joined: '2021-12-20', vehicle: 'TRK-9901', region: 'Southeast' },
    { id: 'DRV-012', name: 'Michael Scott', avatar: 'MS', status: 'active', rating: 4.6, trips: 845, onTime: 94.2, phone: '+1 (555) 345-6780', license: 'CDL-B', joined: '2022-07-15', vehicle: 'VAN-3345', region: 'Northeast' },
    { id: 'DRV-013', name: 'Daniel Martinez', avatar: 'DM', status: 'active', rating: 4.7, trips: 732, onTime: 95.5, phone: '+1 (555) 456-7891', license: 'CDL-A', joined: '2023-03-08', vehicle: 'LTK-4490', region: 'Southwest' },
    { id: 'DRV-014', name: 'Amy Watson', avatar: 'AW', status: 'off-duty', rating: 4.5, trips: 678, onTime: 93.8, phone: '+1 (555) 567-8902', license: 'CDL-B', joined: '2023-05-14', vehicle: 'VAN-7712', region: 'West Coast' },
    { id: 'DRV-015', name: 'Tom Richardson', avatar: 'TR', status: 'active', rating: 4.9, trips: 1356, onTime: 98.1, phone: '+1 (555) 678-9013', license: 'CDL-A', joined: '2021-08-25', vehicle: 'SDN-3388', region: 'Southwest' },
  ],

  // ── Maintenance Tickets ──
  maintenance: {
    scheduled: [
      { id: 'MNT-4501', vehicle: 'TRK-4821', type: 'Oil Change', priority: 'medium', dueDate: '2026-07-15', estimatedCost: '$180', assignedTo: 'Bay 3' },
      { id: 'MNT-4502', vehicle: 'VAN-1293', type: 'Tire Rotation', priority: 'low', dueDate: '2026-07-18', estimatedCost: '$120', assignedTo: 'Bay 1' },
      { id: 'MNT-4503', vehicle: 'EV-0891', type: 'Battery Check', priority: 'medium', dueDate: '2026-07-16', estimatedCost: '$250', assignedTo: 'Bay 5' },
      { id: 'MNT-4504', vehicle: 'SDN-5567', type: 'Brake Inspection', priority: 'high', dueDate: '2026-07-14', estimatedCost: '$340', assignedTo: 'Bay 2' },
    ],
    inProgress: [
      { id: 'MNT-4498', vehicle: 'TRK-7734', type: 'Transmission Repair', priority: 'critical', dueDate: '2026-07-12', estimatedCost: '$2,400', assignedTo: 'Bay 4', progress: 65 },
      { id: 'MNT-4499', vehicle: 'LTK-6654', type: 'AC System', priority: 'medium', dueDate: '2026-07-13', estimatedCost: '$450', assignedTo: 'Bay 2', progress: 40 },
    ],
    completed: [
      { id: 'MNT-4495', vehicle: 'VAN-8845', type: 'Full Service', priority: 'medium', completedDate: '2026-07-10', actualCost: '$680', assignedTo: 'Bay 1' },
      { id: 'MNT-4496', vehicle: 'TRK-9901', type: 'Tire Replace', priority: 'high', completedDate: '2026-07-11', actualCost: '$890', assignedTo: 'Bay 3' },
      { id: 'MNT-4497', vehicle: 'EV-1122', type: 'Software Update', priority: 'low', completedDate: '2026-07-11', actualCost: '$0', assignedTo: 'Bay 5' },
    ],
    overdue: [
      { id: 'MNT-4490', vehicle: 'TRK-3312', type: 'Engine Overhaul', priority: 'critical', dueDate: '2026-07-08', estimatedCost: '$5,200', assignedTo: 'Bay 4', daysOverdue: 4 },
      { id: 'MNT-4491', vehicle: 'TRK-2201', type: 'Brake Pad Replace', priority: 'high', dueDate: '2026-07-10', estimatedCost: '$420', assignedTo: 'Bay 2', daysOverdue: 2 },
    ]
  },

  maintenanceStats: {
    total: 23,
    overdue: 2,
    avgResolution: '2.4 days',
    monthlyBudget: '$45,000',
    monthlySpent: '$32,180',
    completionRate: 91.2
  },

  // ── Fuel & Cost Data ──
  fuelData: {
    monthly: [
      { month: 'Jan', diesel: 42000, gasoline: 18000, electric: 3200, total: 63200 },
      { month: 'Feb', diesel: 39500, gasoline: 16800, electric: 3400, total: 59700 },
      { month: 'Mar', diesel: 44100, gasoline: 19200, electric: 3800, total: 67100 },
      { month: 'Apr', diesel: 41800, gasoline: 17500, electric: 4100, total: 63400 },
      { month: 'May', diesel: 46200, gasoline: 20100, electric: 4500, total: 70800 },
      { month: 'Jun', diesel: 48500, gasoline: 21300, electric: 4800, total: 74600 },
      { month: 'Jul', diesel: 45800, gasoline: 19800, electric: 5200, total: 70800 },
      { month: 'Aug', diesel: 43200, gasoline: 18600, electric: 5500, total: 67300 },
      { month: 'Sep', diesel: 47100, gasoline: 20500, electric: 5800, total: 73400 },
      { month: 'Oct', diesel: 49800, gasoline: 21800, electric: 6200, total: 77800 },
      { month: 'Nov', diesel: 51200, gasoline: 22500, electric: 6500, total: 80200 },
      { month: 'Dec', diesel: 48900, gasoline: 21100, electric: 6800, total: 76800 }
    ],
    costBreakdown: [
      { category: 'Fuel', amount: 845000, percentage: 42, color: '#6C5CE7' },
      { category: 'Maintenance', amount: 324000, percentage: 16, color: '#8B7CF7' },
      { category: 'Insurance', amount: 278000, percentage: 14, color: '#2DD4BF' },
      { category: 'Tolls & Fees', amount: 196000, percentage: 10, color: '#F5A623' },
      { category: 'Labor', amount: 245000, percentage: 12, color: '#22C55E' },
      { category: 'Other', amount: 112000, percentage: 6, color: '#FF5A5F' }
    ],
    costPerKm: [
      { month: 'Jan', value: 1.82 }, { month: 'Feb', value: 1.78 }, { month: 'Mar', value: 1.85 },
      { month: 'Apr', value: 1.80 }, { month: 'May', value: 1.91 }, { month: 'Jun', value: 1.95 },
      { month: 'Jul', value: 1.88 }, { month: 'Aug', value: 1.84 }, { month: 'Sep', value: 1.92 },
      { month: 'Oct', value: 1.98 }, { month: 'Nov', value: 2.01 }, { month: 'Dec', value: 1.96 }
    ],
    topSpenders: [
      { vehicle: 'TRK-4821', type: 'Heavy Truck', fuel: '$8,420', maintenance: '$3,200', total: '$14,820', efficiency: '6.2 km/L' },
      { vehicle: 'TRK-7734', type: 'Heavy Truck', fuel: '$7,890', maintenance: '$5,100', total: '$15,290', efficiency: '5.8 km/L' },
      { vehicle: 'TRK-3312', type: 'Light Truck', fuel: '$6,540', maintenance: '$7,800', total: '$16,540', efficiency: '7.1 km/L' },
      { vehicle: 'TRK-9901', type: 'Heavy Truck', fuel: '$7,210', maintenance: '$2,890', total: '$12,300', efficiency: '6.5 km/L' },
      { vehicle: 'VAN-8845', type: 'Van', fuel: '$4,820', maintenance: '$1,680', total: '$8,700', efficiency: '9.2 km/L' },
      { vehicle: 'TRK-2201', type: 'Heavy Truck', fuel: '$6,980', maintenance: '$2,420', total: '$11,600', efficiency: '6.0 km/L' },
      { vehicle: 'LTK-6654', type: 'Light Truck', fuel: '$5,340', maintenance: '$1,950', total: '$9,490', efficiency: '8.4 km/L' },
      { vehicle: 'VAN-1293', type: 'Van', fuel: '$4,210', maintenance: '$980', total: '$7,390', efficiency: '10.1 km/L' },
    ]
  },

  // ── Reports Data ──
  reports: {
    totalRevenue: 3437000,
    totalCost: 2015000,
    netProfit: 1422000,
    profitMargin: 41.4,
    totalTrips: 18942,
    avgRevenuePerTrip: 181.5,
    routePerformance: [
      { route: 'NYC → Boston', trips: 2845, revenue: '$512,100', cost: '$298,400', profit: '$213,700', onTime: 96.2 },
      { route: 'LA → San Diego', trips: 2156, revenue: '$388,080', cost: '$225,300', profit: '$162,780', onTime: 94.8 },
      { route: 'Houston → Dallas', trips: 1892, revenue: '$340,560', cost: '$198,660', profit: '$141,900', onTime: 93.1 },
      { route: 'Chicago → Detroit', trips: 1678, revenue: '$302,040', cost: '$176,190', profit: '$125,850', onTime: 95.5 },
      { route: 'SF → Oakland', trips: 3210, revenue: '$134,820', cost: '$80,250', profit: '$54,570', onTime: 98.4 },
      { route: 'Seattle → Portland', trips: 1456, revenue: '$262,080', cost: '$152,880', profit: '$109,200', onTime: 96.0 },
      { route: 'DC → Baltimore', trips: 1890, revenue: '$128,520', cost: '$75,600', profit: '$52,920', onTime: 97.1 },
      { route: 'Atlanta → Miami', trips: 1234, revenue: '$222,120', cost: '$148,080', profit: '$74,040', onTime: 89.7 },
    ]
  },

  // ── Alerts ──
  alerts: [
    { id: 1, type: 'critical', title: 'Vehicle TRK-3312 — Engine Alert', message: 'Engine temperature exceeding threshold on I-75 near Atlanta', time: '2 min ago', vehicle: 'TRK-3312' },
    { id: 2, type: 'warning', title: 'Geofence Breach — VAN-8845', message: 'Vehicle has deviated from planned route near Portland, OR', time: '8 min ago', vehicle: 'VAN-8845' },
    { id: 3, type: 'warning', title: 'Low Fuel — EV-1122', message: 'Battery level critical (8%). Nearest charging station: 3.2 mi', time: '12 min ago', vehicle: 'EV-1122' },
    { id: 4, type: 'info', title: 'Maintenance Due — TRK-4821', message: 'Scheduled oil change in 3 days (July 15)', time: '25 min ago', vehicle: 'TRK-4821' },
    { id: 5, type: 'success', title: 'Trip TRP-78432 Completed', message: 'NYC → Boston delivered on time. Rating: 5/5', time: '32 min ago', vehicle: 'TRK-4821' },
    { id: 6, type: 'critical', title: 'Driver Rest Violation', message: 'Robert Brown has exceeded maximum continuous driving hours', time: '45 min ago', vehicle: 'TRK-3312' },
  ],

  // ── Sparkline Data ──
  sparklines: {
    activeVehicles: [780, 795, 810, 825, 830, 818, 835, 840, 838, 842, 845, 842],
    onTimeDelivery: [91.2, 92.0, 91.8, 93.1, 92.5, 93.8, 94.0, 93.5, 94.2, 94.5, 94.3, 94.7],
    fuelEfficiency: [8.8, 8.7, 8.9, 8.6, 8.5, 8.7, 8.4, 8.5, 8.3, 8.4, 8.5, 8.4],
    fleetUtilization: [82.0, 83.5, 84.1, 85.0, 84.5, 86.2, 85.8, 86.5, 87.0, 86.8, 87.1, 87.3],
    avgTripCost: [295, 290, 288, 292, 286, 289, 285, 287, 283, 286, 284, 284],
    openMaintenance: [18, 20, 15, 22, 19, 17, 21, 24, 20, 18, 25, 23]
  }
};
