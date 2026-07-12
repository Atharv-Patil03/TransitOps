import { z } from "zod";

export const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(
      /^[A-Z0-9-\s]{3,15}$/i,
      "Must be between 3 and 15 characters, containing only letters, numbers, spaces, or hyphens"
    ),
  model: z.string().trim().min(1, "Model is required"),
  type: z.string().trim().min(1, "Vehicle type is required"),
  maxLoadCapacityKg: z
    .number({ invalid_type_error: "Must be a valid number" })
    .positive("Capacity must be greater than 0"),
  odometerKm: z
    .number({ invalid_type_error: "Must be a valid number" })
    .min(0, "Odometer reading cannot be negative"),
  acquisitionCost: z
    .number({ invalid_type_error: "Must be a valid number" })
    .positive("Acquisition cost must be greater than 0"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
