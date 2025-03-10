import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ message: "Не авторизирован" }, { status: 401 });
	}
	const user = session.user;
	if (!user?.companyId) {
		return NextResponse.json(
			{ message: "Не найдена компания пользователя" },
			{ status: 400 },
		);
	}

	const orders = await prisma.order.findMany({
		where: { companyId: user.companyId },
		select: {
			id: true,
			createdAt: true,
			counteragent: {
				select: {
					name: true,
				},
			},
		},
	});
	return NextResponse.json(orders);
}
