"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { driverSchema, type DriverInput } from "./schema";

// ---------------------------------------------------------------------------
// Query: Fetch drivers with optional search & status filtering
// ---------------------------------------------------------------------------
export async function getDrivers(search?: string, status?: string) {
  try {
    const whereClause: any = {};

    if (search && search.trim() !== "") {
      const term = search.trim();
      whereClause.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { licenseNumber: { contains: term, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const drivers = await db.driver.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: drivers };
  } catch (error: any) {
    console.error("Error fetching drivers:", error);
    return { success: false, error: error?.message || "Failed to fetch drivers" };
  }
}

// ---------------------------------------------------------------------------
// Query: Fetch a single driver by ID
// ---------------------------------------------------------------------------
export async function getDriverById(id: string) {
  try {
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) {
      return { success: false, error: "Driver not found." };
    }
    return { success: true, data: driver };
  } catch (error: any) {
    console.error("Error fetching driver:", error);
    return { success: false, error: error?.message || "Failed to fetch driver" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Create a new driver
// ---------------------------------------------------------------------------
export async function createDriver(rawValues: any) {
  try {
    const parsed = driverSchema.safeParse({
      name: rawValues.name,
      licenseNumber: rawValues.licenseNumber,
      licenseCategory: rawValues.licenseCategory,
      licenseExpiry: rawValues.licenseExpiry,
      contactNumber: rawValues.contactNumber,
    });

    if (!parsed.success) {
      return {
        success: false,
        validationErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber } =
      parsed.data;

    // Check uniqueness of license number
    const existing = await db.driver.findUnique({
      where: { licenseNumber: licenseNumber.toUpperCase() },
    });

    if (existing) {
      return {
        success: false,
        error: "A driver with this license number already exists.",
      };
    }

    await db.driver.create({
      data: {
        name,
        licenseNumber: licenseNumber.toUpperCase(),
        licenseCategory,
        licenseExpiry: new Date(licenseExpiry),
        contactNumber,
        safetyScore: 100.0,
        status: "AVAILABLE",
      },
    });

    revalidatePath("/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating driver:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Update an existing driver
// ---------------------------------------------------------------------------
export async function updateDriver(id: string, rawValues: any) {
  try {
    const parsed = driverSchema.safeParse({
      name: rawValues.name,
      licenseNumber: rawValues.licenseNumber,
      licenseCategory: rawValues.licenseCategory,
      licenseExpiry: rawValues.licenseExpiry,
      contactNumber: rawValues.contactNumber,
    });

    if (!parsed.success) {
      return {
        success: false,
        validationErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber } =
      parsed.data;

    const existing = await db.driver.findUnique({
      where: { licenseNumber: licenseNumber.toUpperCase() },
    });

    if (existing && existing.id !== id) {
      return {
        success: false,
        error: "Another driver already uses this license number.",
      };
    }

    await db.driver.update({
      where: { id },
      data: {
        name,
        licenseNumber: licenseNumber.toUpperCase(),
        licenseCategory,
        licenseExpiry: new Date(licenseExpiry),
        contactNumber,
      },
    });

    revalidatePath("/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating driver:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Delete a driver permanently
// ---------------------------------------------------------------------------
export async function deleteDriver(id: string) {
  try {
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) {
      return { success: false, error: "Driver not found." };
    }
    if (driver.status === "ON_TRIP") {
      return { success: false, error: "Cannot delete a driver who is currently on a trip." };
    }

    await db.driver.delete({ where: { id } });

    revalidatePath("/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting driver:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Suspend a driver
// ---------------------------------------------------------------------------
export async function suspendDriver(id: string) {
  try {
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) {
      return { success: false, error: "Driver not found." };
    }
    if (driver.status === "SUSPENDED") {
      return { success: false, error: "Driver is already suspended." };
    }
    if (driver.status === "ON_TRIP") {
      return { success: false, error: "Cannot suspend a driver who is currently on a trip." };
    }

    await db.driver.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });

    revalidatePath("/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error suspending driver:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}

// ---------------------------------------------------------------------------
// Mutation: Activate a driver
// ---------------------------------------------------------------------------
export async function activateDriver(id: string) {
  try {
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) {
      return { success: false, error: "Driver not found." };
    }
    if (driver.status === "AVAILABLE") {
      return { success: false, error: "Driver is already active and available." };
    }

    await db.driver.update({
      where: { id },
      data: { status: "AVAILABLE" },
    });

    revalidatePath("/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error activating driver:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}
