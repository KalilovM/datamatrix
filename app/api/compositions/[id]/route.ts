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

async function findCompositionForUser(id: string) {
	const user = await getCurrentUser();

	if (!user) {
		return {
			user: null,
			composition: null,
			response: NextResponse.json(
				{ message: "Не авторизован" },
				{ status: 401 },
			),
		};
	}

	const where =
		user.role === "ADMIN"
			? { id }
			: {
					id,
					companyId: user.companyId ?? "",
				};

	const composition = await prisma.composition.findFirst({
		where,
		select: {
			id: true,
			name: true,
			companyId: true,
		},
	});

	if (!composition) {
		return {
			user,
			composition: null,
			response: NextResponse.json(
				{ error: "Состав не найден" },
				{ status: 404 },
			),
		};
	}

	return { user, composition, response: null };
}

function getCompositionError(error: unknown) {
	if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === "P2002"
	) {
		return "Состав с таким названием уже существует";
	}

	return "Произошла ошибка при обновлении";
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const compositionId = (await params).id;
	const { composition, response } = await findCompositionForUser(compositionId);

	if (response || !composition) {
		return response;
	}

	const usedInNomenclature = await prisma.nomenclature.count({
		where: {
			compositionId: composition.id,
		},
	});

	if (usedInNomenclature > 0) {
		return NextResponse.json(
			{
				error:
					"Нельзя удалить состав, пока он используется в номенклатуре.",
			},
			{ status: 409 },
		);
	}

	await prisma.composition.delete({
		where: {
			id: composition.id,
		},
	});

	return NextResponse.json({ message: "Состав удален" });
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const compositionId = (await params).id;
	const { composition, response } = await findCompositionForUser(compositionId);

	if (response || !composition) {
		return response;
	}

	const formData = await req.formData();
	const name = String(formData.get("name") || "").trim();

	if (!name) {
		return NextResponse.json(
			{ error: "Название состава обязательно" },
			{ status: 400 },
		);
	}

	try {
		await prisma.composition.update({
			where: {
				id: composition.id,
			},
			data: {
				name,
			},
		});

		return NextResponse.json({ message: "Состав обновлен" });
	} catch (error) {
		return NextResponse.json(
			{ error: getCompositionError(error) },
			{ status: 400 },
		);
	}
}
