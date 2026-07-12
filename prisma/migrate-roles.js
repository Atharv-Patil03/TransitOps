const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Migrate PASSENGER → DRIVER (lowest privilege in new system)
  const r1 = await prisma.$executeRawUnsafe(
    `UPDATE "User" SET role = 'DRIVER' WHERE role = 'PASSENGER'`
  );
  console.log(`Migrated ${r1} PASSENGER → DRIVER`);

  // Keep ADMIN and DRIVER as-is
  console.log("Migration complete.");
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
