"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { vehicleSchema, type VehicleInput } from "./schema";

// ---------------------------------------------------------------------------
// Query: Fetch all vehicles (with optional search & status filter)
// ---------------------------------------------------------------------------
export async function getVehicles(search?: string, status?: string) {
  try {
    const whereClause: any = {};

    if (search && search.trim() !== "") {
      whereClause.registrationNumber = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const vehicles = await db.vehicle.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: vehicles };
  } catch (error: any) {
    console.error("Error fetching vehicles:", error);
    return { success: false, error: error?.message || "Failed to fetch vehicles" };
  }
}

// ---------------------------------------------------------------------------
// Query: Fetch a single vehicle by ID
// ---------------------------------------------------------------------------
export async function getVehicleById(id: string) {
  try {
    const vehicle = await db.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      return { success: false, error: "Vehicle not found." };
    }
    return { success: true, data: vehicle };
  } catch (error: any) {
    console.error("Error fetching vehicle:", error);
    return { success: false, error: error?.message || "Failed to fetch vehicle" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Create a new vehicle
// ---------------------------------------------------------------------------
export async function createVehicle(rawValues: any) {
  try {
    const parsed = vehicleSchema.safeParse({
      registrationNumber: rawValues.registrationNumber,
      model: rawValues.model,
      type: rawValues.type,
      maxLoadCapacityKg: parseFloat(rawValues.maxLoadCapacityKg),
      odometerKm: parseFloat(rawValues.odometerKm),
      acquisitionCost: parseFloat(rawValues.acquisitionCost),
    });

    if (!parsed.success) {
      return { success: false, validationErrors: parsed.error.flatten().fieldErrors };
    }

    const { registrationNumber, model, type, maxLoadCapacityKg, odometerKm, acquisitionCost } =
      parsed.data;

    const existing = await db.vehicle.findUnique({
      where: { registrationNumber: registrationNumber.toUpperCase() },
    });

    if (existing) {
      return { success: false, error: "A vehicle with this registration number already exists." };
    }

    await db.vehicle.create({
      data: {
        registrationNumber: registrationNumber.toUpperCase(),
        model,
        type,
        maxLoadCapacityKg,
        odometerKm,
        acquisitionCost,
        status: "AVAILABLE",
      },
    });

    revalidatePath("/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Update an existing vehicle
// ---------------------------------------------------------------------------
export async function updateVehicle(id: string, rawValues: any) {
  try {
    const parsed = vehicleSchema.safeParse({
      registrationNumber: rawValues.registrationNumber,
      model: rawValues.model,
      type: rawValues.type,
      maxLoadCapacityKg: parseFloat(rawValues.maxLoadCapacityKg),
      odometerKm: parseFloat(rawValues.odometerKm),
      acquisitionCost: parseFloat(rawValues.acquisitionCost),
    });

    if (!parsed.success) {
      return { success: false, validationErrors: parsed.error.flatten().fieldErrors };
    }

    const { registrationNumber, model, type, maxLoadCapacityKg, odometerKm, acquisitionCost } =
      parsed.data;

    // Check that the registration number isn't taken by a DIFFERENT vehicle
    const existing = await db.vehicle.findUnique({
      where: { registrationNumber: registrationNumber.toUpperCase() },
    });

    if (existing && existing.id !== id) {
      return { success: false, error: "Another vehicle already uses this registration number." };
    }

    await db.vehicle.update({
      where: { id },
      data: {
        registrationNumber: registrationNumber.toUpperCase(),
        model,
        type,
        maxLoadCapacityKg,
        odometerKm,
        acquisitionCost,
      },
    });

    revalidatePath("/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Delete a vehicle permanently
// ---------------------------------------------------------------------------
export async function deleteVehicle(id: string) {
  try {
    // Prevent deleting vehicles that are currently ON_TRIP
    const vehicle = await db.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      return { success: false, error: "Vehicle not found." };
    }
    if (vehicle.status === "ON_TRIP") {
      return { success: false, error: "Cannot delete a vehicle that is currently on a trip." };
    }

    await db.vehicle.delete({ where: { id } });

    revalidatePath("/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting vehicle:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Retire a vehicle (soft-delete via status change)
// ---------------------------------------------------------------------------
export async function retireVehicle(id: string) {
  try {
    const vehicle = await db.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      return { success: false, error: "Vehicle not found." };
    }
    if (vehicle.status === "RETIRED") {
      return { success: false, error: "Vehicle is already retired." };
    }
    if (vehicle.status === "ON_TRIP") {
      return { success: false, error: "Cannot retire a vehicle that is currently on a trip." };
    }

    await db.vehicle.update({
      where: { id },
      data: { status: "RETIRED" },
    });

    revalidatePath("/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error retiring vehicle:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}
