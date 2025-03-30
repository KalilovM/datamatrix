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
	const { companyId } = user;
	if (!companyId) return NextResponse.json([]);

	const packs = await prisma.generatedCodePack.findMany({
		where: { nomenclature: { companyId } },
		include: {
			codes: {
				select: { value: true },
			},
			nomenclature: {
				select: {
					name: true,
					modelArticle: true,
					color: true,
					codePacks: {
						select: {
							size: true,
						},
					},
				},
			},
			configuration: { select: { pieceInPack: true, packInPallet: true } },
		},
	});

	// Fetch pallets
	const pallets = await prisma.generatedCodePallet.findMany({
		where: { nomenclature: { companyId } },
		include: {
			nomenclature: {
				select: {
					name: true,
					modelArticle: true,
					color: true,
					codePacks: {
						select: {
							size: true,
						},
					},
				},
			},
			configuration: { select: { pieceInPack: true, packInPallet: true } },
		},
	});

	// Format packs
	const formattedPacks = packs.map((pack) => ({
		name: pack.nomenclature.name,
		modelArticle: pack.nomenclature.modelArticle,
		size: pack.nomenclature.codePacks
			.map((codePack) => codePack.size)
			.join(", "),
		color: pack.nomenclature.color,
		generatedCode: pack.value,
		configuration: `1-${pack.configuration.pieceInPack}-${
			pack.configuration.packInPallet
		}`,
		codes: pack.codes.map((code) => code.value),
		type: "Пачка",
		createdAt: pack.createdAt,
	}));

	// Format pallets
	const formattedPallets = pallets.map((pallet) => ({
		name: pallet.nomenclature.name,
		modelArticle: pallet.nomenclature.modelArticle,
		size: pallet.nomenclature.codePacks
			.map((codePack) => codePack.size)
			.join(", "),
		color: pallet.nomenclature.color,
		generatedCode: pallet.value,
		configuration: `1-${pallet.configuration.pieceInPack}-${
			pallet.configuration.packInPallet
		}`,
		type: "Паллет",
		createdAt: pallet.createdAt,
	}));

	const result = [...formattedPacks, ...formattedPallets].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return NextResponse.json(result);
}
