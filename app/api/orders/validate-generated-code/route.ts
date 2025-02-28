import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { generatedCode } = await req.json();
    if (!generatedCode) {
      return NextResponse.json(
        { error: "Введите сгенерированный код!" },
        { status: 400 },
      );
    }

    // Check if the code exists
    const codePack = await prisma.generatedCodePack.findUnique({
      where: { value: generatedCode },
      include: { codes: true },
    });

    const codePallet = await prisma.generatedCodePallet.findUnique({
      where: { value: generatedCode },
      include: { generatedCodePacks: { include: { codes: true } } },
    });

    if (!codePack && !codePallet) {
      return NextResponse.json({ error: "Код не найден!" }, { status: 404 });
    }

    // Extract codes
    const linkedCodes = codePack
      ? codePack.codes
      : codePallet?.generatedCodePacks.flatMap((pack) => pack.codes) || [];

    return NextResponse.json({ linkedCodes });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте позже." },
      { status: 500 },
    );
  }
}
