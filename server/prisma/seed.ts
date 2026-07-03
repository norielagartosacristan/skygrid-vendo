import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("NS?Formula@01", 10);

  await prisma.user.upsert({
    where: { email: "admin@skygrid.com" },
    update: {},
    create: {
  fullName: "System Administrator",
  email: "admin@skygrid.com",
  password: hashed,
}
  });

  console.log("✅ Admin seeded");
}

main()
  .finally(() => prisma.$disconnect());