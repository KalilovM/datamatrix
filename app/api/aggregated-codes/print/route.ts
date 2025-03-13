import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const PRINT_TYPE = "AGGREGATION";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}
	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		select: {
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
	if (!companyId) return NextResponse.json(null);

	const template = await prisma.printingTemplate.findFirst({
		where: { companyId, isDefault: true, type: PRINT_TYPE },
		include: { fields: true },
	});

	return NextResponse.json(template);
}
