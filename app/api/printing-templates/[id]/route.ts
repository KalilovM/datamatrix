import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
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
				{ error: "Пользователь не найден" },
				{ status: 401 },
			);
		}

		if (user.role !== "ADMIN" && !user.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}

		const template = await prisma.printingTemplate.findFirst({
			where:
				user.role === "ADMIN"
					? { id }
					: {
							id,
							companyId: user.companyId ?? undefined,
						},
			select: {
				id: true,
			},
		});

		if (!template) {
			return NextResponse.json({ error: "Шаблон не найден" }, { status: 404 });
		}

		await prisma.printingTemplate.delete({
			where: {
				id: template.id,
			},
		});

		return NextResponse.json(
			{ message: "Шаблон успешно удален" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Ошибка при удалении шаблона печати:", error);
		return NextResponse.json(
			{ error: "Ошибка при удалении шаблона печати" },
			{ status: 500 },
		);
	}
}
