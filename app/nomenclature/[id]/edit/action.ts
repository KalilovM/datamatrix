import { prisma } from "@/lib/prisma";

export async function getNomenclatureById(id: string) {
  return await prisma.nomenclature.findUnique({
    where: { id },
    include: {
      configurations: true,
      codePacks: {
        include: {
          codes: true,
        },
      },
    },
  });
}
