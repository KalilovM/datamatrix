import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
			value: row.nomenclature.name,
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
	try {
		const orderId = Number.parseInt((await params).id);
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

		// Parse incoming request body
		const { counteragentId, generatedCodePacks } = await req.json();
		console.log(generatedCodePacks);

		// Validate required fields
		if (!orderId || !counteragentId || !generatedCodePacks) {
			return NextResponse.json(
				{ message: "Не переданы обязательные параметры" },
				{ status: 400 },
			);
		}

		// Ensure the order exists and belongs to the company
		const existingOrder = await prisma.order.findUnique({
			where: { id: orderId },
			select: { companyId: true },
		});

		if (!existingOrder) {
			return NextResponse.json({ message: "Заказ не найден" }, { status: 404 });
		}

		if (existingOrder.companyId !== user.companyId) {
			return NextResponse.json(
				{ message: "Нет доступа к этому заказу" },
				{ status: 403 },
			);
		}

		// Update order: clear existing generated codes and set new ones
		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: {
				counteragentId,
				generatedCodePacks: {
					set: [],
					connect: generatedCodePacks.map((code: string) => ({ value: code })),
				},
			},
		});

		return NextResponse.json(updatedOrder);
	} catch (error: any) {
		console.error("Ошибка при обновлении заказа:", error);
		return NextResponse.json(
			{ message: "Ошибка при обновлении заказа", error: error.message },
			{ status: 500 },
		);
	}
}
