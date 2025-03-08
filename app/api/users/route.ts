import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";

const ROLE_TRANSLATIONS: Record<string, string> = {
  ADMIN: "Администратор",
  COMPANY_ADMIN: "Админ фирмы",
  COMPANY_USER: "Пользователь",
};

export async function GET() {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { role, companyId } = session.user;

    let users;
    if (role === "ADMIN") {
      // Admin can see all users
      users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          role: true,
          companyId: true,
        },
      });
    } else {
      // Non-admins can only see users in their company
      users = await prisma.user.findMany({
        where: { companyId: companyId || "" },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });
    }
    const translatedUsers = users.map((user) => ({
         ...user,
         role: ROLE_TRANSLATIONS[user.role] || "Неизвестная роль",
       }));

    return NextResponse.json(translatedUsers, { status: 200 });
  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
    return NextResponse.json({ error: "Ошибка загрузки пользователей" }, { status: 500 });
  }
}
