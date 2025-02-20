"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./auth";
import { prisma } from "./prisma";

export async function getActiveUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    redirect("/login");
  }
  const payload = await decrypt(session);
  if (!payload) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });
  if (!user) {
    cookieStore.delete("session");
    redirect("/login");
  }
  return user;
}
