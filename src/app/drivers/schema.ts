import { z } from "zod";

export const driverSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),
  licenseNumber: z
    .string()
    .trim()
    .min(1, "License number is required")
    .regex(
      /^[A-Z0-9-\s]{3,20}$/i,
      "License number must be 3–20 characters (letters, numbers, hyphens, spaces)"
    ),
  licenseCategory: z
    .string()
    .trim()
    .min(1, "License category is required"),
  licenseExpiry: z
    .string()
    .min(1, "Expiry date is required")
    .refine(
      (val) => new Date(val) > new Date(),
      "License expiry date must be in the future"
    ),
  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .regex(
      /^[+]?[\d\s()-]{7,15}$/,
      "Enter a valid phone number (7–15 digits, may include +, spaces, dashes)"
    ),
});

export type DriverInput = z.infer<typeof driverSchema>;
