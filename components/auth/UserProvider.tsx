"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function UserProvider({
  children,
}: {
  children: (
    user: Awaited<ReturnType<typeof getCurrentUser>>,
  ) => React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return <>{children(user)}</>;
}
