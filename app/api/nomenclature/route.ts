import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
		}
		const user = session.user;
		if (!user?.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании", user: user },
				{ status: 404 },
			);
		}
		if (user.role === "ADMIN") {
			const nomenclatureOptions = await prisma.nomenclature.findMany({
				select: {
					id: true,
					name: true,
					modelArticle: true,
					size: true,
					color: true,
				},
			});

			return NextResponse.json(nomenclatureOptions);
		}

		const nomenclatureOptions = await prisma.nomenclature.findMany({
			where: { companyId: user.companyId },
			select: {
				id: true,
				name: true,
				modelArticle: true,
				size: true,
				color: true,
			},
		});

		return NextResponse.json(nomenclatureOptions);
	} catch (error) {
		console.error("Ошибка загрузки номенклатуры:", error);
		return NextResponse.json(
			{ error: "Ошибка загрузки данных" },
			{ status: 500 },
		);
	}
}
