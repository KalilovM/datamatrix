import { prisma } from "@/lib/prisma";

export async function getNonmenclatures() {
  return await prisma.nomenclature.findMany();
}
