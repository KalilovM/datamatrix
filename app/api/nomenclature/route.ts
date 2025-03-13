import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
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
	const { role, companyId } = user;
	let nomenclatures;
	if (role === "ADMIN") {
		nomenclatures = await prisma.nomenclature.findMany({
			select: {
				id: true,
				name: true,
				codePacks: {
					select: {
						codes: {
							where: { used: false },
							select: { id: true },
						},
					},
				},
			},
		});
	} else {
		if (!companyId) {
			return NextResponse.json(
				{ message: "Не установлен ID компании" },
				{ status: 404 },
			);
		}
		nomenclatures = await prisma.nomenclature.findMany({
			where: { companyId },
			select: {
				id: true,
				name: true,
				codePacks: {
					select: {
						codes: {
							where: { used: false },
							select: { id: true },
						},
					},
				},
			},
		});
	}

	const result = nomenclatures.map((nomenclature) => ({
		id: nomenclature.id,
		name: nomenclature.name,
		codeCount: nomenclature.codePacks.reduce(
			(total, codePack) => total + codePack.codes.length,
			0,
		),
	}));

	return NextResponse.json(result);
}
