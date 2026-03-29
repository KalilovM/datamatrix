import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const { id } = data;

		if (!id) {
			return NextResponse.json(
				{ error: "Не указан ID шаблона" },
				{ status: 400 },
			);
		}

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

		if (!user.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}

		const companyId = user.companyId;
		const template = await prisma.printingTemplate.findFirst({
			where: {
				id,
				companyId,
			},
		});

		if (!template) {
			return NextResponse.json({ error: "Шаблон не найден" }, { status: 404 });
		}

		const updatedTemplate = await prisma.$transaction(async (tx) => {
			await tx.printingTemplate.updateMany({
				where: {
					companyId,
					type: template.type,
					isDefault: true,
				},
				data: {
					isDefault: false,
				},
			});

			return tx.printingTemplate.update({
				where: {
					id: template.id,
				},
				data: { isDefault: true },
			});
		});

		return NextResponse.json(updatedTemplate);
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Ошибка при установке шаблона по умолчанию" },
			{ status: 500 },
		);
	}
}
