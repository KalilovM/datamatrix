import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";

export async function getAggregatedCodes() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}

	const { companyId, role } = session.user;

	if (!companyId) return [];

	// Fetch packs
	const packs = await prisma.generatedCodePack.findMany({
		where: { nomenclature: { companyId } },
		include: {
			codes: {
				select: { value: true },
			},
			nomenclature: {
				select: { name: true, modelArticle: true, size: true, color: true },
			},
			configuration: { select: { pieceInPack: true, packInPallet: true } },
		},
	});

	// Fetch pallets
	const pallets = await prisma.generatedCodePallet.findMany({
		where: { nomenclature: { companyId } },
		include: {
			nomenclature: {
				select: { name: true, modelArticle: true, size: true, color: true },
			},
			configuration: { select: { pieceInPack: true, packInPallet: true } },
		},
	});

	// Format packs
	const formattedPacks = packs.map((pack) => ({
		name: pack.nomenclature.name,
		modelArticle: pack.nomenclature.modelArticle,
		size: pack.nomenclature.size,
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
		size: pallet.nomenclature.size,
		color: pallet.nomenclature.color,
		generatedCode: pallet.value,
		configuration: `1-${pallet.configuration.pieceInPack}-${
			pallet.configuration.packInPallet
		}`,
		type: "Паллет",
		createdAt: pallet.createdAt,
	}));

	return [...formattedPacks, ...formattedPallets].sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	);
}

export async function getDefaultPrintTemplate() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}

	const { companyId } = session.user;

	if (!companyId) return [];

	return await prisma.printingTemplate.findFirst({
		where: { companyId, isDefault: true },
		include: {
			fields: true,
		},
	});
}
