import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { code: codeData } = await req.json();
		console.log(codeData);
		if (!codeData) {
			return NextResponse.json({ error: "Введите код!" }, { status: 400 });
		}

		const code = await prisma.code.findUnique({
			where: {
				value: codeData,
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
