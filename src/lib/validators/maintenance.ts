import { z } from 'zod';

export const MaintenanceStatus = {
  INITIATED: 'INITIATED',
  COMPLETED: 'COMPLETED',
} as const;

// Zod schema for starting maintenance
export const startMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  garage: z.string().trim().min(1, 'Garage name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
});

// Zod schema for finishing maintenance
export const finishMaintenanceSchema = z.object({
  cost: z.number({ required_error: 'Cost is required' }).nonnegative('Cost cannot be negative'),
  endDate: z.coerce.date({ required_error: 'End date is required' }),
});

export type StartMaintenanceInput = z.infer<typeof startMaintenanceSchema>;
export type FinishMaintenanceInput = z.infer<typeof finishMaintenanceSchema>;
