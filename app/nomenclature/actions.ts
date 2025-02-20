import { prisma } from "@/lib/prisma";

export async function getNonmenclatures() {
  const nomenclatures = await prisma.nomenclature.findMany({
    select: {
      id: true,
      name: true,
      codePacks: {
        select: {
          codes: {
            where: { used: false },
            select: { id: true },
          },
        },
      },
    },
  });

  return nomenclatures.map((nomenclature) => ({
    id: nomenclature.id,
    name: nomenclature.name,
    codeCount: nomenclature.codePacks.reduce(
      (total, codePack) => total + codePack.codes.length,
      0,
    ),
  }));
}
