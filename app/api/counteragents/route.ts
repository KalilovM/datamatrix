import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const formData = await request.formData();
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

	const name = formData.get("name") as string;
	const inn = formData.get("inn") as string;
	const kpp = formData.get("kpp") as string;

	try {
		await prisma.counteragent.create({
			data: {
				name,
				inn,
				kpp,
				companyId: user.companyId,
			},
		});
		return NextResponse.json({ message: "Контрагент успешно сохранен" });
	} catch (error) {
		return NextResponse.json(
			{ error: "Произошла ошибка при сохранении" },
			{ status: 400 },
		);
	}
}

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
			{ error: "Требуется наличие компании" },
			{ status: 401 },
		);
	}
	try {
		let counteragents = [];
		if (user.role === "ADMIN") {
			counteragents = await prisma.counteragent.findMany();
		} else {
			counteragents = await prisma.counteragent.findMany({
				where: {
					companyId: user.companyId,
				},
			});
		}
		return NextResponse.json(counteragents);
	} catch (error) {
		return NextResponse.json(
			{ error: "Произошла ошибка при получении данных" },
			{ status: 400 },
		);
	}
}
