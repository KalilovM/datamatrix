import { exit } from "node:process";

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

const prettyPrint = (object) =>
  console.log(JSON.stringify(object, undefined, 2));

async function seed() {
  const user = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: "admin",
      username: "admin",
      role: "ADMIN",
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
