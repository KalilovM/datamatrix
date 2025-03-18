import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
			showId: true,
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

export async function POST(req: Request) {
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
			{ message: "Не найдена компания пользователя" },
			{ status: 400 },
		);
	}

	const { counteragentId, generatedCodePacks } = await req.json();
	if (!counteragentId || !generatedCodePacks) {
		return NextResponse.json(
			{ message: "Не переданы обязательные параметры" },
			{ status: 400 },
		);
	}

	const order = await prisma.order.create({
		data: {
			companyId: user.companyId,
			counteragentId,
			generatedCodePacks: {
				connect: generatedCodePacks.map((code: string) => ({ value: code })),
			},
		},
	});

	const orderId = `ORDER-${order.id.toString().padStart(8, "0")}`;

	await prisma.order.update({
		where: {
			id: order.id,
		},
		data: {
			showId: orderId,
		},
	});

	return NextResponse.json(order);
}
