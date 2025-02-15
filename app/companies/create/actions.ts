"use server";

import { prisma } from "@/lib/prisma";
import { FormState } from "./defenitions";
import { NewCompanySchema } from "./defenitions";
import { redirect } from "next/navigation";

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function createNewCompany(state: FormState, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    token: formData.get("token") as string,
    subscriptionEnd: formData.get("subscriptionEnd") as string,
    users: formData.getAll("users") as string[],
  };
  const result = NewCompanySchema.safeParse(data);

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

  await prisma.company.create({
    data: {
      name: data.name,
      token: data.token,
      subscriptionEnd: new Date(data.subscriptionEnd),
      users: {
        connect: data.users.map((id) => ({ id })),
      },
    },
  });

  redirect("/companies");
}
