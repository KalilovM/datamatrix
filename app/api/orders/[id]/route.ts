import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { convertToSpecialCodeFormat } from "../validate-code/route";

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = Number.parseInt((await params).id);
	await prisma.order.delete({
		where: { id },
	});
	return NextResponse.json(
		{ message: "success" },
		{
			status: 200,
		},
	);
}

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const order = await prisma.order.findUnique({
		where: { id: Number.parseInt(id, 10) },
		select: {
			id: true,
			showId: true,
			counteragent: {
				select: {
					id: true,
					name: true,
				},
			},
			generatedCodePacks: {
				select: {
					id: true,
					value: true,
					codes: {
						select: {
							value: true,
						},
					},
					nomenclature: {
						select: {
							name: true,
							id: true,
						},
					},
				},
			},
			orderNomenclature: {
				select: {
					id: true,
					nomenclature: {
						select: {
							name: true,
							id: true,
						},
					},
					quantity: true,
					preparedQuantity: true,
				},
			},
		},
	});

	if (!order) {
		return NextResponse.json(
			{ message: "Order not found" },
			{
				status: 404,
			},
		);
	}

	const linkedCodes = await prisma.code.findMany({
		where: { orderId: Number.parseInt(id, 10) },
		select: {
			value: true,
			codePack: {
				select: {
					nomenclature: {
						select: {
							name: true,
							id: true,
						},
					},
				},
			},
		},
	});

	const linked = linkedCodes.map((code) => ({
		generatedCode: code.value,
		nomenclature: code.codePack.nomenclature.name,
		codes: [code.value],
	}));

	const initialSelectedCounteragent = {
		label: order.counteragent.name,
		value: order.counteragent.id,
	};

	const aggregated = order.generatedCodePacks.map((pack) => ({
		id: pack.id,
		codes: pack.codes.map((code) => code.value),
		generatedCode: pack.value,
		nomenclature: pack.nomenclature.name,
	}));

	const initialRows = order.orderNomenclature.map((row) => ({
		id: row.id,
		nomenclature: {
			label: row.nomenclature.name,
			value: row.nomenclature.id,
		},
		numberOfOrders: row.quantity,
		numberOfPreparedOrders: row.preparedQuantity,
	}));

	const initialCodes = [...linked, ...aggregated];

	const orderData = {
		id: order.id,
		showId: order.showId,
	};

	return NextResponse.json({
		initialSelectedCounteragent,
		initialCodes,
		initialRows,
		orderData,
	});
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { companyId: true },
	});

	if (!user?.companyId) {
		return NextResponse.json(
			{ message: "Компания не найдена" },
			{ status: 400 },
		);
	}

	const orderId = Number.parseInt((await params).id);
	if (Number.isNaN(orderId)) {
		return NextResponse.json(
			{ message: "Неверный ID заказа" },
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

	// Verify order belongs to the user's company
	const existingOrder = await prisma.order.findUnique({
		where: { id: orderId },
		select: { companyId: true },
	});

	if (!existingOrder || existingOrder.companyId !== user.companyId) {
		return NextResponse.json({ message: "Доступ запрещен" }, { status: 403 });
	}

	// Disconnect old relations
	await prisma.order.update({
		where: { id: orderId },
		data: {
			generatedCodePacks: { set: [] },
		},
	});

	await prisma.orderNomenclature.deleteMany({ where: { orderId } });
	await prisma.code.updateMany({
		where: { orderId },
		data: { used: false, orderId: null },
	});

	// Re-attach updated data
	await prisma.order.update({
		where: { id: orderId },
		data: {
			counteragentId,
			generatedCodePacks: {
				connect: generatedCodePacks.map((code: string) => ({ value: code })),
			},
		},
	});

	if (rows.length > 0) {
		await prisma.orderNomenclature.createMany({
			data: rows.map((row) => ({
				orderId,
				nomenclatureId: row.nomenclature.value,
				quantity: Number(row.numberOfOrders),
				preparedQuantity: Number(row.numberOfPreparedOrders),
			})),
		});
	}

	await prisma.code.updateMany({
		where: {
			value: { in: codes },
		},
		data: {
			used: true,
			orderId: orderId,
		},
	});

	return NextResponse.json({ message: "Заказ успешно обновлен" });
}
