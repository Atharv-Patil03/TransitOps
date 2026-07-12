/**
 * src/lib/db.ts
 * Singleton Prisma Client — spec-required path.
 * Re-exports from the root lib/prisma.ts to avoid duplicate instances.
 */

export { prisma } from "@/lib/prisma";
export { prisma as db } from "@/lib/prisma";
export { default } from "@/lib/prisma";
