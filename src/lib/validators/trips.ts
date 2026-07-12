import { z } from 'zod';

export const TripStatus = {
  DRAFT: 'DRAFT',
  DISPATCHED: 'DISPATCHED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const VehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  IN_SHOP: 'IN_SHOP',
  RETIRED: 'RETIRED',
} as const;

export const DriverStatus = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  SUSPENDED: 'SUSPENDED',
  EXPIRED_LICENSE: 'EXPIRED_LICENSE',
} as const;

// Strict Zod schema for Trip Creation
export const createTripSchema = z.object({
  source: z.string().trim().min(1, 'Source is required'),
  destination: z.string().trim().min(1, 'Destination is required'),
  cargoDesc: z.string().trim().min(1, 'Cargo description is required'),
  cargoWeight: z.number({ required_error: 'Cargo weight is required' }).positive('Cargo weight must be a positive number'),
  plannedDist: z.number({ required_error: 'Planned distance is required' }).positive('Planned distance must be a positive number'),
  departureDate: z.coerce.date({ required_error: 'Departure date is required' }),
  expectedArrival: z.coerce.date({ required_error: 'Expected arrival date is required' }),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  driverId: z.string().min(1, 'Driver ID is required'),
  notes: z.string().optional().nullable(),
}).refine((data) => data.expectedArrival > data.departureDate, {
  message: 'Expected arrival date must be after departure date',
  path: ['expectedArrival'],
});

// Zod schema for completing a trip
export const completeTripSchema = z.object({
  actualDist: z.number({ required_error: 'Actual distance is required' }).positive('Actual distance must be positive'),
  finalOdometer: z.number({ required_error: 'Final odometer is required' }).positive('Final odometer must be positive'),
  fuelUsed: z.number({ required_error: 'Fuel used is required' }).positive('Fuel used must be positive'),
});

// Zod schema for validating Business Logic rules
export const businessLogicSchema = z.object({
  cargoWeight: z.number().positive(),
  vehicle: z.object({
    id: z.string(),
    capacity: z.number().positive(),
    status: z.string(),
  }),
  driver: z.object({
    id: z.string(),
    status: z.string(),
    licenseExpiry: z.coerce.date(),
  }),
}).refine((data) => data.cargoWeight <= data.vehicle.capacity, {
  message: 'Cargo weight exceeds vehicle capacity',
  path: ['cargoWeight'],
}).refine((data) => data.vehicle.status === VehicleStatus.AVAILABLE, {
  message: 'Vehicle must be AVAILABLE',
  path: ['vehicle.status'],
}).refine((data) => data.driver.status === DriverStatus.AVAILABLE, {
  message: 'Driver must be AVAILABLE',
  path: ['driver.status'],
}).refine((data) => data.driver.licenseExpiry > new Date(), {
  message: 'Driver license has expired',
  path: ['driver.licenseExpiry'],
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
export type BusinessLogicInput = z.infer<typeof businessLogicSchema>;
