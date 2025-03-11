import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const PRINT_TYPE = "AGGREGATION";

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
	}

	const { companyId } = session.user;
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
