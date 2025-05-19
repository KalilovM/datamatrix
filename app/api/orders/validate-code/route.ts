import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

function normalizeScannerInput(raw: string): string {
	const GS = String.fromCharCode(29); // ASCII 29
	return `�${raw.split(GS).join("\x1D")}`; // insert raw ASCII 29 back
}

export async function POST(req: Request) {
	try {
		const { code: codeData } = await req.json();
		const formattedCode = normalizeScannerInput(codeData);
		if (!codeData) {
			return NextResponse.json({ error: "Введите код!" }, { status: 400 });
		}

		const code = await prisma.code.findUnique({
			where: {
				value: formattedCode,
				used: false,
			},
			select: {
				id: true,
				value: true,
				codePack: {
					select: {
						nomenclature: {
							select: {
								id: true,
								name: true,
								modelArticle: true,
							},
						},
					},
				},
			},
		});

		if (!code) {
			return NextResponse.json(
				{ error: "Код уже использован!" },
				{ status: 404 },
			);
		}

		const result = {
			id: code.id,
			code: code.value,
			nomenclature: code.codePack.nomenclature,
		};

		return NextResponse.json(result);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Ошибка сервера!" }, { status: 500 });
	}
}
