"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FormState } from "./defenitions";
import { LoginSchema } from "./defenitions";
import { createSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function login(state: FormState, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = LoginSchema.safeParse({ username, password });
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

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || user.password !== password) {
    return {
      errors: {
        username: ["Неверный логин или пароль"],
      },
    };
  }

  const session = await createSession(user.id, user.role);
  const cookieStore = await cookies();
  cookieStore.set("session", session.token, {
    expires: session.expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  redirect("/companies");
}
