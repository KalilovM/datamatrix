import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function getNomenclatureOptions() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          company: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  if (!user) return null;
  if (!user.user.company) return null;

  return await prisma.nomenclature.findMany({
    where: {
      companyId: user.user.company.id,
    },
    select: {
      id: true,
      name: true,
      configurations: {
        select: {
          id: true,
          nomenclatureId: true,
          pieceInPack: true,
          packInPallet: true,
        },
      },
    },
  });
}
