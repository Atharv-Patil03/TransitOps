/**
 * src/lib/db.ts
 * Singleton Prisma Client — spec-required path.
 * Re-exports from the root lib/prisma.ts to avoid duplicate instances.
 */

import { prisma } from "@/lib/prisma";

export { prisma };
export { prisma as db };
export default prisma;
