const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Wiping database tables for hackathon schema sync...");
  
  const tables = [
    "Booking", "FuelLog", "MaintenanceRecord", "Expense", 
    "Trip", "Driver", "Vehicle", "Stop", "Route", "User"
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      console.log(`  ✅ Wiped: ${table}`);
    } catch (e) {
      // Ignore errors if the table doesn't exist yet
      console.log(`  ℹ️  Skipped (table may not exist yet): ${table}`);
    }
  }
  
  console.log("✨ Wiped all existing tables successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
