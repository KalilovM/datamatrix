import {
	AGGREGATED_CODES_PAGE_SIZE,
	type IAggregatedCode,
} from "@/aggregation-codes/definitions";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const MAX_PAGE_SIZE = 100;

type CombinedRow = {
	id: string;
	recordType: "pack" | "pallet";
	createdAt: Date;
};

const createContainsFilter = (value?: string) =>
	value ? { contains: value, mode: "insensitive" as const } : undefined;

const createEmptyResponse = (pageSize: number) => ({
	items: [] as IAggregatedCode[],
	totalCount: 0,
	totalPages: 1,
	page: 1,
	pageSize,
});

const packInclude = {
	codes: {
		select: { value: true },
	},
	nomenclature: {
		select: {
			name: true,
			modelArticle: true,
			color: true,
			sizeGtin: {
				select: {
					size: true,
				},
			},
		},
	},
	configuration: {
		select: { pieceInPack: true, packInPallet: true },
	},
} satisfies Prisma.GeneratedCodePackInclude;

const palletInclude = {
	nomenclature: {
		select: {
			name: true,
			modelArticle: true,
			color: true,
			sizeGtin: {
				select: {
					size: true,
				},
			},
		},
	},
	configuration: {
		select: { pieceInPack: true, packInPallet: true },
	},
} satisfies Prisma.GeneratedCodePalletInclude;

type PackWithRelations = Prisma.GeneratedCodePackGetPayload<{
	include: typeof packInclude;
}>;

type PalletWithRelations = Prisma.GeneratedCodePalletGetPayload<{
	include: typeof palletInclude;
}>;

const formatModelArticle = (
	modelArticle: string | null,
	color: string | null,
) => [modelArticle, color].filter((value): value is string => Boolean(value)).join("-");

const formatPack = (pack: PackWithRelations): IAggregatedCode => ({
	name: pack.nomenclature.name,
	modelArticle: formatModelArticle(
		pack.nomenclature.modelArticle,
		pack.nomenclature.color,
	),
	size: pack.nomenclature.sizeGtin.map((size) => size.size).join(", "),
	color: pack.nomenclature.color ?? "",
	generatedCode: pack.value,
	configuration: `1-${pack.configuration.pieceInPack}-${pack.configuration.packInPallet}`,
	codes: pack.codes.map((code) => code.value),
	type: "Пачка",
	createdAt: pack.createdAt,
});

const formatPallet = (pallet: PalletWithRelations): IAggregatedCode => ({
	name: pallet.nomenclature.name,
	modelArticle: formatModelArticle(
		pallet.nomenclature.modelArticle,
		pallet.nomenclature.color,
	),
	size: pallet.nomenclature.sizeGtin.map((size) => size.size).join(", "),
	color: pallet.nomenclature.color ?? "",
	generatedCode: pallet.value,
	configuration: `1-${pallet.configuration.pieceInPack}-${pallet.configuration.packInPallet}`,
	type: "Паллет",
	createdAt: pallet.createdAt,
});

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

	const url = new URL(req.url);
	const name = url.searchParams.get("name") || undefined;
	const modelArticle = url.searchParams.get("modelArticle") || undefined;
	const color = url.searchParams.get("color") || undefined;
	const generatedCode = url.searchParams.get("generatedCode") || undefined;
	const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
	const requestedPageSize = Number.parseInt(
		url.searchParams.get("pageSize") ?? String(AGGREGATED_CODES_PAGE_SIZE),
		10,
	);

	const pageSize = Number.isNaN(requestedPageSize)
		? AGGREGATED_CODES_PAGE_SIZE
		: Math.min(Math.max(requestedPageSize, 1), MAX_PAGE_SIZE);
	const initialPage = Number.isNaN(requestedPage)
		? 1
		: Math.max(requestedPage, 1);

	const { companyId } = user;
	if (!companyId) {
		return NextResponse.json(createEmptyResponse(pageSize));
	}

	const packWhere: Prisma.GeneratedCodePackWhereInput = {
		value: createContainsFilter(generatedCode),
		nomenclature: {
			companyId,
			name: createContainsFilter(name),
			modelArticle: createContainsFilter(modelArticle),
			color: createContainsFilter(color),
		},
	};

	const palletWhere: Prisma.GeneratedCodePalletWhereInput = {
		value: createContainsFilter(generatedCode),
		nomenclature: {
			companyId,
			name: createContainsFilter(name),
			modelArticle: createContainsFilter(modelArticle),
			color: createContainsFilter(color),
		},
	};

	const [packCount, palletCount] = await prisma.$transaction([
		prisma.generatedCodePack.count({ where: packWhere }),
		prisma.generatedCodePallet.count({ where: palletWhere }),
	]);

	const totalCount = packCount + palletCount;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const page = Math.min(initialPage, totalPages);

	if (totalCount === 0) {
		return NextResponse.json({
			items: [],
			totalCount,
			totalPages,
			page,
			pageSize,
		});
	}

	const packConditions: Prisma.Sql[] = [Prisma.sql`n."companyId" = ${companyId}`];
	if (generatedCode) {
		packConditions.push(Prisma.sql`gp."value" ILIKE ${`%${generatedCode}%`}`);
	}
	if (name) {
		packConditions.push(Prisma.sql`n."name" ILIKE ${`%${name}%`}`);
	}
	if (modelArticle) {
		packConditions.push(
			Prisma.sql`n."modelArticle" ILIKE ${`%${modelArticle}%`}`,
		);
	}
	if (color) {
		packConditions.push(Prisma.sql`n."color" ILIKE ${`%${color}%`}`);
	}

	const palletConditions: Prisma.Sql[] = [Prisma.sql`n."companyId" = ${companyId}`];
	if (generatedCode) {
		palletConditions.push(Prisma.sql`gpl."value" ILIKE ${`%${generatedCode}%`}`);
	}
	if (name) {
		palletConditions.push(Prisma.sql`n."name" ILIKE ${`%${name}%`}`);
	}
	if (modelArticle) {
		palletConditions.push(
			Prisma.sql`n."modelArticle" ILIKE ${`%${modelArticle}%`}`,
		);
	}
	if (color) {
		palletConditions.push(Prisma.sql`n."color" ILIKE ${`%${color}%`}`);
	}

	const offset = (page - 1) * pageSize;
	const combinedRows = await prisma.$queryRaw<CombinedRow[]>(Prisma.sql`
		SELECT combined."id", combined."recordType", combined."createdAt"
		FROM (
			SELECT gp."id", 'pack' AS "recordType", gp."createdAt"
			FROM "GeneratedCodePack" gp
			INNER JOIN "Nomenclature" n ON n."id" = gp."nomenclatureId"
			WHERE ${Prisma.join(packConditions, Prisma.sql` AND `)}

			UNION ALL

			SELECT gpl."id", 'pallet' AS "recordType", gpl."createdAt"
			FROM "GeneratedCodePallet" gpl
			INNER JOIN "Nomenclature" n ON n."id" = gpl."nomenclatureId"
			WHERE ${Prisma.join(palletConditions, Prisma.sql` AND `)}
		) AS combined
		ORDER BY combined."createdAt" DESC, combined."recordType" ASC, combined."id" DESC
		LIMIT ${pageSize}
		OFFSET ${offset}
	`);

	const packIds = combinedRows
		.filter((row) => row.recordType === "pack")
		.map((row) => row.id);
	const palletIds = combinedRows
		.filter((row) => row.recordType === "pallet")
		.map((row) => row.id);

	const [packs, pallets] = await Promise.all([
		packIds.length > 0
			? prisma.generatedCodePack.findMany({
					where: { id: { in: packIds } },
					include: packInclude,
				})
			: Promise.resolve<PackWithRelations[]>([]),
		palletIds.length > 0
			? prisma.generatedCodePallet.findMany({
					where: { id: { in: palletIds } },
					include: palletInclude,
				})
			: Promise.resolve<PalletWithRelations[]>([]),
	]);

	const packMap = new Map(packs.map((pack) => [pack.id, formatPack(pack)]));
	const palletMap = new Map(
		pallets.map((pallet) => [pallet.id, formatPallet(pallet)]),
	);

	const items = combinedRows
		.map((row) =>
			row.recordType === "pack" ? packMap.get(row.id) : palletMap.get(row.id),
		)
		.filter((item): item is IAggregatedCode => Boolean(item));

	return NextResponse.json({
		items,
		totalCount,
		totalPages,
		page,
		pageSize,
	});
}
