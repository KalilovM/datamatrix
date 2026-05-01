import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

function formatScannedCode(raw: string): string {
	return raw.trim().replace(/[^a-zA-Z0-9+=_]/g, "");
}

export async function POST(req: Request) {
	try {
		const { code: codeData } = await req.json();
		if (!codeData) {
			return NextResponse.json({ error: "Введите код!" }, { status: 400 });
		}

		const formattedCode = formatScannedCode(codeData);
		if (!formattedCode) {
			return NextResponse.json({ error: "Введите код!" }, { status: 400 });
		}

		const matchingCodes = await prisma.code.findMany({
			where: { formattedValue: formattedCode },
			select: {
				id: true,
				value: true,
				used: true,
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
		const code = matchingCodes.find((matchingCode) => !matchingCode.used);

		if (matchingCodes.length === 0) {
			return NextResponse.json(
				{ error: "Код не найден!" },
				{ status: 404 },
			);
		}

		if (!code) {
			return NextResponse.json(
				{ error: "Код уже использован!" },
				{ status: 409 },
			);
		}

		return NextResponse.json({
			id: code.id,
			code: code.value,
			formattedCode,
			nomenclature: code.codePack.nomenclature,
		});
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json({ error: "Ошибка сервера!" }, { status: 500 });
	}
}
