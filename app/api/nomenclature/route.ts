import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
	}

	const url = new URL(req.url);
	const name = url.searchParams.get("name") || undefined;
	const modelArticle = url.searchParams.get("modelArticle") || undefined;
	const color = url.searchParams.get("color") || undefined;
	const GTIN = url.searchParams.get("gtin") || undefined;

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

	const where: any = {
		name: name ? { contains: name, mode: "insensitive" } : undefined,
		modelArticle: modelArticle
			? { contains: modelArticle, mode: "insensitive" }
			: undefined,
		color: color ? { contains: color, mode: "insensitive" } : undefined,
		GTIN: GTIN ? { contains: GTIN, mode: "insensitive" } : undefined,
	};

	if (user.role !== "ADMIN") {
		if (!user.companyId) {
			return NextResponse.json(
				{ message: "Не установлен ID компании" },
				{ status: 404 },
			);
		}
		where.companyId = user.companyId;
	}

	const nomenclatures = await prisma.nomenclature.findMany({
		where,
		select: {
			id: true,
			name: true,
			GTIN: true,
			color: true,
			modelArticle: true,
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

	const result = nomenclatures.map((nomenclature) => ({
		id: nomenclature.id,
		name: nomenclature.name,
		GTIN: nomenclature.GTIN,
		color: nomenclature.color,
		modelArticle: nomenclature.modelArticle,
		codeCount: nomenclature.codePacks.reduce(
			(total, codePack) => total + codePack.codes.length,
			0,
		),
	}));

	return NextResponse.json(result);
}
