"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";
import prisma from "./prisma";
//
// write a function that returns the active user using cookies stored and decode
export async function getActiveUser() {
  const session = await cookies.get("session");
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
    redirect("/login");
  }
  return user;
}
