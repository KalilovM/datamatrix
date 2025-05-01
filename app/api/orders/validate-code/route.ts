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
		console.log(formattedCode);

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
			nomenclature: code.codePack.nomenclature.modelArticle,
		};

		return NextResponse.json(result);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Ошибка сервера!" }, { status: 500 });
	}
}

// 0104700010816467215VXjvWb6rgBr91EE1192OUO6SdTwJiWSSp4Y1TUONxHbz49qx8iGhBshq1yxvSM=
// 0104700010816467215VXjvWb6rgBr91EE1192OUO6SdTwJiWSSp4Y1TUONxHbz49qx8iGhBshq1yxvSM=
