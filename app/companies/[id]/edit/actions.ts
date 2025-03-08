"use server";

import { prisma } from "@/shared/lib/prisma";
import { EditCompanySchema } from "./schema";
import type { Company, FormData } from "./types";

export async function fetchUsers() {
  return await prisma.user.findMany({
    select: { id: true, username: true },
  });
}

export async function fetchCompanyById(id: string): Promise<Company> {
  const company = await prisma.company.findUnique({
    where: { id },
    include: { users: { select: { id: true, username: true } } },
  });

  if (!company) {
    throw new Error("Компания не найдена");
  }

  return company;
}

export async function updateCompany(id: string, data: FormData) {
  const parsedData = EditCompanySchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Неверные данные");
  }

  await prisma.company.update({
    where: { id },
    data: {
      name: parsedData.data.name,
      subscriptionEnd: new Date(parsedData.data.subscriptionEnd),
      users: {
        set: parsedData.data.users.map((userId) => ({ id: userId })),
      },
    },
  });
}
