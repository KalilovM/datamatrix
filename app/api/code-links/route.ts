import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

function normalizeScannerInput(raw: string): string {
	const GS = String.fromCharCode(29);
	return `�${raw.split(GS).join("\x1D")}`;
}

export async function POST(req: Request) {
	try {
		const { code } = await req.json();
		if (!code) {
			return NextResponse.json({ error: "Введите код!" }, { status: 400 });
		}
		const formatted = normalizeScannerInput(code);
		const pack = await prisma.code.findUnique({
			where: { value: formatted },
			select: {
				value: true,
				generatedCodePack: {
					select: {
						nomenclature: true,
						codes: {
							select: { value: true },
						},
					},
				},
			},
		});
		if (pack) {
			return NextResponse.json({
				generatedCodePack: {
					value: pack.value || "",
					codes: pack.generatedCodePack?.codes || [],
					nomenclature: pack.generatedCodePack?.nomenclature || null,
				},
			});
		}

		const foundCode = await prisma.code.findFirst({
			where: { formattedValue: formatted },
			include: {
				generatedCodePack: { include: { codes: true, nomenclature: true } },
			},
		});

		if (!foundCode || !foundCode.generatedCodePack) {
			return NextResponse.json(
				{ error: "Код не найден или не привязан к агрегированному коду!" },
				{ status: 404 },
			);
		}

		const gPack = foundCode.generatedCodePack;
		return NextResponse.json({
			generatedCodePack: {
				value: gPack.value,
				nomenclature: gPack.nomenclature,
				codes: gPack.codes,
			},
		});
	} catch {
		return NextResponse.json(
			{ error: "Ошибка сервера. Попробуйте позже." },
			{ status: 500 },
		);
	}
}
