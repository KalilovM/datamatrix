import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const nomenclatureId = (await params).id;

		if (!nomenclatureId) {
			return NextResponse.json(
				{ error: "Номенклатура не выбрана" },
				{ status: 400 },
			);
		}

		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
		}

		// Fetch configurations
		const configurations = await prisma.configuration.findMany({
			where: { nomenclatureId },
			select: { id: true, pieceInPack: true, packInPallet: true },
		});

		const result = configurations.map((config) => ({
			id: config.id,
			pieceInPack: config.pieceInPack,
			packInPallet: config.packInPallet,
			nomenclatureId: nomenclatureId,
		}));

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Ошибка загрузки конфигурации" },
			{ status: 500 },
		);
	}
}
