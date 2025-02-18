"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { FormState, UpdateUserSchema } from "./defenitions";

export async function updateUser(
  state: FormState,
  formData: FormData,
): Promise<{ errors: Record<string, string> } | void> {
  // Extract form data.
  const data = {
    id: formData.get("id") as string,
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string, // May be an empty string if not updating.
    role: formData.get("role") as string,
    companyId: formData.get("companyId") as string,
  };

  // Remove password field if empty.
  if (data.password === "") {
    delete data.password;
  }

  // Validate using Zod.
  const result = UpdateUserSchema.safeParse(data);
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

  // Build the update payload using Prisma's types.
  const updateData: Prisma.UserUpdateInput = {
    email: result.data.email,
    username: result.data.username,
    role: result.data.role,
  };

  if (result.data.password) {
    // IMPORTANT: Hash the password before storing it in production.
    updateData.password = result.data.password;
  }

  // Update company relation: connect if provided, otherwise disconnect.
  if (result.data.companyId) {
    updateData.company = { connect: { id: result.data.companyId } };
  } else {
    updateData.company = { disconnect: true };
  }

  await prisma.user.update({
    where: { id: result.data.id },
    data: updateData,
  });

  // Redirect upon successful update.
  redirect("/users");
}

export async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      companyId: true,
    },
  });
}

export async function getCompanies() {
  return await prisma.company.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}
