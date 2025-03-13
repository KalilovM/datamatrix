import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const PRINT_TYPE = "NOMENCLATURE";

export async function GET(req: Request) {
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
	const { companyId } = user;

	if (!companyId) {
		return NextResponse.json(
			{ message: "Не установлен ID компании" },
			{ status: 404 },
		);
	}

	const template = await prisma.printingTemplate.findFirst({
		where: {
			companyId: companyId,
			type: PRINT_TYPE,
			isDefault: true,
		},
		select: {
			width: true,
			height: true,
			qrPosition: true,
			qrType: true,
			fields: {
				select: {
					order: true,
					fieldType: true,
					isBold: true,
					fontSize: true,
				},
			},
		},
	});
	if (!template) {
		return NextResponse.json(
			{ error: "Шаблон печати не найден" },
			{ status: 404 },
		);
	}
	return NextResponse.json(template);
}
