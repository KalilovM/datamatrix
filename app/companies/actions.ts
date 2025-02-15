import { prisma } from "@/lib/prisma";

export async function getCompanies() {
  return await prisma.company.findMany({
    include: {
      users: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          companyId: true,
        },
      },
    },
  });
}
