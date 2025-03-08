import { prisma } from "@/shared/lib/prisma";

export async function getCompanies() {
  return prisma.company.findMany({
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
