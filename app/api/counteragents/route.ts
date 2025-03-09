import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
	}
	const user = session.user;

	if (!user?.companyId) {
		return NextResponse.json(
			{ error: "Требуется наличие компании" },
			{ status: 401 },
		);
	}

	const name = formData.get("name") as string;
	const inn = formData.get("inn") as string;

	try {
		await prisma.counteragent.create({
			data: {
				name,
				inn,
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
		return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
	}
	const user = session.user;

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
