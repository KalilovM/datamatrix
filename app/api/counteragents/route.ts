import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const user = await getCurrentUser();
  if (!user?.companyId) {
    return NextResponse.json(
      { error: "Требуется наличие компании" },
      { status: 401 },
    );
  }

  const name = formData.get("name") as string;
  const inn = formData.get("inn") as string;

  try {
    await prisma.counteragent.create({
      data: {
        name,
        inn,
        companyId: user.companyId,
      },
    });
    return NextResponse.json({ message: "Контрагент успешно сохранен" });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка при сохранении" },
      { status: 400 },
    );
  }
}
