"use server";

import { prisma } from "@/shared/lib/prisma";
import {
  FormState,
  NewCompanySchema,
} from "@/app/companies/create/defenitions";
import { redirect } from "next/navigation";

export async function getCompany(id: string) {
  return await prisma.company.findUnique({
    where: { id },
    include: { users: true },
  });
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function updateCompany(state: FormState, formData: FormData) {
  console.log("FORMDATA", formData);
  const data = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    token: formData.get("token") as string,
    subscriptionEnd: formData.get("subscriptionEnd") as string,
    users: formData.getAll("users") as string[],
  };

  // Validate using Zod.
  const result = NewCompanySchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.reduce(
      (acc: Record<string, string>, curr) => {
        if (curr.path.length > 0) {
          const field = curr.path[0] as string;
          acc[field] = acc[field]
            ? `${acc[field]}, ${curr.message}`
            : curr.message;
        }
        return acc;
      },
      {},
    );
    return { errors };
  }

  // Update the company.
  await prisma.company.update({
    where: { id: data.id },
    data: {
      name: data.name,
      token: data.token, // Typically read-only, but we include it for completeness.
      subscriptionEnd: new Date(data.subscriptionEnd),
      users: {
        set: data.users.map((id) => ({ id })),
      },
    },
  });

  // Redirect upon successful update.
  redirect("/companies");
}
