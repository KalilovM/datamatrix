import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "Invalid code" }, { status: 400 });
  }

  try {
    const generatedCodePack = await prisma.generatedCodePack.findUnique({
      where: { value: code },
      include: { codes: true },
    });

    if (!generatedCodePack) {
      return NextResponse.json(
        { message: "DataMatrix code not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ codes: generatedCodePack.codes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT handler: Updates the linked codes based on user input
export async function PUT(request: Request) {
  try {
    const { code, codes } = await request.json();

    if (!code || !codes) {
      return NextResponse.json(
        { message: "Не заполнены все поля" },
        { status: 400 },
      );
    }

    const generatedCodePack = await prisma.generatedCodePack.findUnique({
      where: { value: code },
      include: { codes: true },
    });

    if (!generatedCodePack) {
      return NextResponse.json(
        { message: "Datamatrix код не найден" },
        { status: 404 },
      );
    }

    // Update each code record
    const updatePromises = codes.map(
      async (c: { id: string; value: string }) => {
        return prisma.code.update({
          where: { id: c.id },
          data: { value: c.value },
        });
      },
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Коды обновлены!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Произошла ошибка" }, { status: 500 });
  }
}
