import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const { id, templateType } = data;

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
		if (!user?.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}

		// Verify the template exists and belongs to the user's company
		const template = await prisma.printingTemplate.findFirst({
			where: {
				id,
				companyId: user.companyId,
			},
		});

		if (!template) {
			return NextResponse.json({ error: "Шаблон не найден" }, { status: 404 });
		}

		// Set all templates for the company as not default
		await prisma.printingTemplate.updateMany({
			where: {
				companyId: user.companyId,
				type: templateType,
			},
			data: {
				isDefault: false,
			},
		});

		// Set the selected template as default
		const updatedTemplate = await prisma.printingTemplate.update({
			where: {
				id: id,
				type: templateType,
			},
			data: { isDefault: true },
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
