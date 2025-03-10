import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const generateRandomOrderId = () => {
	const characters =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let orderId = "order-";
	for (let i = 0; i < 8; i++) {
		orderId += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return orderId;
};

// Function to get a unique order ID
const getUniqueOrderId = async () => {
	let orderId;
	let existingOrder;

	do {
		orderId = generateRandomOrderId();
		existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
	} while (existingOrder); // Repeat if ID exists

	return orderId;
};

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

export async function POST(req: Request) {
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

	const { counteragentId, generatedCodePacks } = await req.json();
	if (!counteragentId || !generatedCodePacks) {
		return NextResponse.json(
			{ message: "Не переданы обязательные параметры" },
			{ status: 400 },
		);
	}
	console.log(generatedCodePacks);
	const orderId = await getUniqueOrderId();

	const order = await prisma.order.create({
		data: {
			id: orderId,
			companyId: user.companyId,
			counteragentId,
			generatedCodePacks: {
				connect: generatedCodePacks.map((code: string) => ({ value: code })),
			},
		},
	});
	return NextResponse.json(order);
}
