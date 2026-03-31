import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function getCurrentUser() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return null;
	}

	return prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		select: {
			role: true,
			companyId: true,
		},
	});
}

function getCompositionError(error: unknown) {
	if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === "P2002"
	) {
		return "Состав с таким названием уже существует";
	}

	return "Произошла ошибка при сохранении";
}

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}

	if (!user.companyId) {
		return NextResponse.json(
			{ error: "Требуется наличие компании" },
			{ status: 401 },
		);
	}

	const name = String(formData.get("name") || "").trim();

	if (!name) {
		return NextResponse.json(
			{ error: "Название состава обязательно" },
			{ status: 400 },
		);
	}

	try {
		await prisma.composition.create({
			data: {
				name,
				companyId: user.companyId,
			},
		});

		return NextResponse.json({ message: "Состав успешно сохранен" });
	} catch (error) {
		return NextResponse.json(
			{ error: getCompositionError(error) },
			{ status: 400 },
		);
	}
}

export async function GET() {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}

	if (user.role === "ADMIN") {
		const compositions = await prisma.composition.findMany({
			orderBy: [{ name: "asc" }, { createdAt: "desc" }],
		});

		return NextResponse.json(compositions);
	}

	if (!user.companyId) {
		return NextResponse.json(
			{ error: "Требуется наличие компании" },
			{ status: 401 },
		);
	}

	const compositions = await prisma.composition.findMany({
		where: {
			companyId: user.companyId,
		},
		orderBy: [{ name: "asc" }, { createdAt: "desc" }],
	});

	return NextResponse.json(compositions);
}
