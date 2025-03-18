import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { generatedCode } = await req.json();
		if (!generatedCode) {
			return NextResponse.json(
				{ error: "Введите сгенерированный код!" },
				{ status: 400 },
			);
		}

		const codePack = await prisma.generatedCodePack.findUnique({
			where: { value: generatedCode },
			include: { codes: true, nomenclature: true },
		});

		const codePallet = await prisma.generatedCodePallet.findUnique({
			where: { value: generatedCode },
			include: {
				generatedCodePacks: { include: { codes: true, nomenclature: true } },
			},
		});

		if (!codePack && !codePallet) {
			return NextResponse.json({ error: "Код не найден!" }, { status: 404 });
		}

		const linkedCodes = codePack
			? codePack.codes
			: codePallet?.generatedCodePacks.flatMap((pack) => pack.codes) || [];

		const nomenclature =
			codePack?.nomenclature.name ||
			codePallet?.generatedCodePacks[0].nomenclature.name;

		return NextResponse.json({ linkedCodes, nomenclature });
	} catch (error) {
		return NextResponse.json(
			{ error: "Ошибка сервера. Попробуйте позже." },
			{ status: 500 },
		);
	}
}
