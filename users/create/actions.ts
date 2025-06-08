"use server";

import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import { FormState, NewUserSchema } from "./definitions";
import { Role } from "@prisma/client";

export async function getCompanies() {
  return await prisma.company.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

export async function createUser(state: FormState, formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
    companyId: formData.get("companyId") as string,
  };

  const result = NewUserSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.reduce(
      (acc: Record<string, string>, curr) => {
        if (curr.path.length > 0) {
          const field = curr.path[0];
          acc[field] = curr.message;
        }
        return acc;
      },
      {},
    );

    return { errors };
  }

  await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role as Role,
      companyId: data.companyId,
    },
  });

  return redirect("/companies");
}
