import { codesToCsv } from "@/nomenclature/lib/helpers";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const nomenclatureId = (await params).id;
	await prisma.nomenclature.delete({
		where: {
			id: nomenclatureId,
		},
	});
	return new Response("Success!", {
		status: 200,
	});
}

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json(null, { status: 401 });
	}

	const nomenclature = await prisma.nomenclature.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			modelArticle: true,
			color: true,
			configurations: true,
			codePacks: {
				select: {
					id: true,
					name: true,
					codes: {
						select: {
							value: true,
						},
					},
					sizeGtin: {
						select: {
							id: true,
							gtin: true,
							size: true,
						},
					},
					createdAt: true,
				},
			},
			sizeGtin: {
				select: {
					id: true,
					size: true,
					gtin: true,
				},
			},
		},
	});

	if (!nomenclature) {
		return NextResponse.json(null, { status: 404 });
	}

	const transformed = {
		id: nomenclature.id,
		name: nomenclature.name,
		modelArticle: nomenclature.modelArticle || "",
		color: nomenclature.color || "",
		GTIN: nomenclature.sizeGtin.map((sizeGtin) => sizeGtin.gtin),
		size: nomenclature.sizeGtin.map((sizeGtin) => sizeGtin.size),
		sizeGtin:
			nomenclature.sizeGtin.map((sizeGtin) => ({
				id: sizeGtin.id,
				size: sizeGtin.size,
				GTIN: sizeGtin.gtin,
			})) ?? [],
		configurations: nomenclature.configurations.map((cfg) => ({
			id: cfg.id,
			label: `1-${cfg.pieceInPack}-${cfg.packInPallet}`,
			value: {
				pieceInPack: cfg.pieceInPack,
				packInPallet: cfg.packInPallet,
			},
		})),
		codes: nomenclature.codePacks.map((pack) => ({
			id: pack.id,
			fileName: pack.name,
			size: String(pack.sizeGtin?.size ?? ""),
			GTIN: String(pack.sizeGtin?.gtin ?? ""),
			sizeGtin: pack.sizeGtin?.id,
			content: codesToCsv(pack.codes.map((code) => code.value)),
			createdAt: pack.createdAt,
			codes: pack.codes.map((code) => code.value),
		})),
	};

	return NextResponse.json(transformed);
}
