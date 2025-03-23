import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { convertToSpecialCodeFormat } from "./validate-code/route";

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true, companyId: true },
	});

	if (!user) {
		return NextResponse.json(
			{ message: "Пользователь не найден" },
			{ status: 401 },
		);
	}

	if (!user.companyId) {
		return NextResponse.json(
			{ message: "Не найдена компания пользователя" },
			{ status: 400 },
		);
	}

	// Fetch orders and include OrderNomenclatures
	const orders = await prisma.order.findMany({
		where: { companyId: user.companyId },
		select: {
			id: true,
			showId: true,
			createdAt: true,
			counteragent: { select: { name: true } },
			orderNomenclature: {
				select: {
					quantity: true,
					preparedQuantity: true,
				},
			},
		},
	});

	// Add total fields to each order
	const enrichedOrders = orders.map((order) => {
		const totalQuantity = order.orderNomenclature.reduce(
			(sum, item) => sum + item.quantity,
			0,
		);
		const totalPrepared = order.orderNomenclature.reduce(
			(sum, item) => sum + item.preparedQuantity,
			0,
		);

		return {
			id: order.id,
			showId: order.showId,
			createdAt: order.createdAt,
			counteragent: order.counteragent,
			totalQuantity,
			totalPrepared,
		};
	});

	return NextResponse.json(enrichedOrders);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true, companyId: true },
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

	const {
		counteragentId,
		generatedCodePacks: allCodePacks,
		rows,
	} = await req.json();
	const isUUID = (str: string) =>
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

	const generatedCodePacks = allCodePacks.filter(isUUID);

	const codes = allCodePacks
		.filter((code: string) => !isUUID(code))
		.map(convertToSpecialCodeFormat);
	if (!counteragentId || !generatedCodePacks || !rows) {
		return NextResponse.json(
			{ message: "Не переданы обязательные параметры" },
			{ status: 400 },
		);
	}

	// Create order
	const order = await prisma.order.create({
		data: {
			companyId: user.companyId,
			counteragentId,
			generatedCodePacks: {
				connect: generatedCodePacks.map((code: string) => ({ value: code })),
			},
		},
	});

	// Generate order ID
	const orderId = `ORDER-${order.id.toString().padStart(8, "0")}`;
	await prisma.order.update({
		where: { id: order.id },
		data: { showId: orderId },
	});

	// Format order nomenclature data
	const orderNomenclatureData = rows.map((row) => ({
		orderId: order.id,
		nomenclatureId: row.nomenclature.value, // Extract the ID
		quantity: Number.parseInt(row.numberOfOrders, 10),
		preparedQuantity: Number.parseInt(row.numberOfPreparedOrders, 10),
	}));

	// Insert into OrderNomenclature table
	if (orderNomenclatureData.length > 0) {
		await prisma.orderNomenclature.createMany({
			data: orderNomenclatureData,
		});
	}
	// updating codes
	await prisma.code.updateMany({
		where: {
			value: {
				in: codes,
			},
		},
		data: {
			used: true,
			orderId: order.id,
		},
	});

	return NextResponse.json(order);
}
