/**
 * Seed script: Creates the one and only default system admin.
 * Run with: npx prisma db seed
 *
 * This is idempotent — it won't create a duplicate if the admin already exists.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@transitops.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@1234";
  const name = process.env.ADMIN_NAME ?? "System Admin";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // If user exists but is not admin, promote them
    if (existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      });
      console.log(`✅ Promoted existing user "${email}" to ADMIN.`);
    } else {
      console.log(`ℹ️  System admin "${email}" already exists. Skipping.`);
    }
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashed, role: "ADMIN" },
  });

  console.log(`✅ System admin created: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ⚠️  Change this password after first login!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
