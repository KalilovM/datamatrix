import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
		}
		const user = await prisma.user.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				role: true,
				companyId: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ message: "Пользователь не найден" },
				{ status: 401 },
			);
		}
		const { role, companyId } = user;
		if (!companyId) {
			return NextResponse.json(
				{ message: "Не установлен ID компании" },
				{ status: 404 },
			);
		}

		if (role === "ADMIN") {
			const nomenclatureOptions = await prisma.nomenclature.findMany({
				select: {
					id: true,
					name: true,
					modelArticle: true,
					color: true,
				},
			});

			return NextResponse.json(nomenclatureOptions);
		}

		const nomenclatureOptions = await prisma.nomenclature.findMany({
			where: { companyId },
			select: {
				id: true,
				name: true,
				modelArticle: true,
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
