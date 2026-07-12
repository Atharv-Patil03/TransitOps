/**
 * lib/session.ts
 * Server-side session helpers — read JWT cookie, enforce roles.
 * Compatible with API Routes and Server Components.
 */

import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "@/lib/auth";

export type { JWTPayload };

/** All fleet roles in order of privilege */
export const ALL_ROLES = [
  "ADMIN",
  "FLEET_MANAGER",
  "SAFETY_OFFICER",
  "FINANCIAL_ANALYST",
  "DRIVER",
] as const;

export type FleetRole = (typeof ALL_ROLES)[number];

/**
 * Returns the current user from the JWT cookie, or null if not authenticated.
 * Use in Server Components and API Route handlers.
 */
export async function getServerSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("transitops_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Asserts that the current user is authenticated and has one of the allowed roles.
 * Throws a typed error object that can be converted to a NextResponse.
 *
 * @example
 * const user = await requireRole(["FLEET_MANAGER", "ADMIN"]);
 */
export async function requireRole(
  allowedRoles: FleetRole[]
): Promise<JWTPayload> {
  const session = await getServerSession();
  if (!session) {
    throw { code: "UNAUTHENTICATED", message: "Not authenticated", status: 401 };
  }
  if (!allowedRoles.includes(session.role as FleetRole)) {
    throw {
      code: "FORBIDDEN",
      message: `Role ${session.role} is not authorized. Required: ${allowedRoles.join(", ")}`,
      status: 403,
    };
  }
  return session;
}

/** Role display labels */
export const ROLE_LABELS: Record<string, string> = {
  ADMIN:              "System Admin",
  FLEET_MANAGER:      "Fleet Manager",
  DRIVER:             "Driver",
  SAFETY_OFFICER:     "Safety Officer",
  FINANCIAL_ANALYST:  "Financial Analyst",
};

/** Role badge colors (CSS var-compatible) */
export const ROLE_COLORS: Record<string, string> = {
  ADMIN:             "#f43f5e",
  FLEET_MANAGER:     "#3b82f6",
  DRIVER:            "#f59e0b",
  SAFETY_OFFICER:    "#10b981",
  FINANCIAL_ANALYST: "#8b5cf6",
};
