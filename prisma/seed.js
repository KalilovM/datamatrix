import { exit } from "node:process";

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

const prettyPrint = (object) =>
  console.log(JSON.stringify(object, undefined, 2));

async function seed() {
  const company = await prisma.company.create({
     data: {
       name: "ОсОО 'Тестовая компания'",
       subscriptionEnd: new Date("2025-12-31"),
     },
   });

   const user = await prisma.user.create({
     data: {
       email: "admin@example.com",
       password: "admin",
       username: "admin",
       role: "ADMIN",
       companyId: company.id,
     },
   });

  console.log("========= 🌱 result of seed: =========");
  prettyPrint({ user });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    exit(1);
  });
