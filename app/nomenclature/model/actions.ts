"use server";

import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import {
	checkExistingCodes,
	codesToCsv,
	parseAndValidateCsvCodes,
	processCodeFile,
} from "../lib/helpers";
import type { ProcessedCodeFile } from "../model/types";
import { syncCodePacks, syncConfigurations, syncSizeGtin } from "./helpers";
import type { NomenclatureEditData, NomenclatureFormData } from "./schema";

export async function fetchNomenclatures() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
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
		return [];
	}
	if (!user?.companyId) {
		return [];
	}
	const { role, companyId } = user;
	let nomenclatures;
	if (role === "ADMIN") {
		nomenclatures = await prisma.nomenclature.findMany({
			select: {
				id: true,
				name: true,
				modelArticle: true,
				color: true,
				GTIN: true,
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
			throw new Error("Не установлен ID компании");
		}
		nomenclatures = await prisma.nomenclature.findMany({
			where: { companyId },
			select: {
				id: true,
				name: true,
				modelArticle: true,
				color: true,
				GTIN: true,
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

	return nomenclatures.map((nomenclature) => ({
		id: nomenclature.id,
		name: nomenclature.name,
		modelArticle: nomenclature.modelArticle || "",
		color: nomenclature.color || "",
		GTIN: nomenclature.GTIN || "",
		codeCount: nomenclature.codePacks.reduce(
			(total, codePack) => total + codePack.codes.length,
			0,
		),
	}));
}

export async function fetchConfigurations() {
	return await prisma.configuration.findMany({
		select: {
			id: true,
			basePiece: true,
			pieceInPack: true,
			packInPallet: true,
		},
	});
}

export async function fetchNomenclatureById(
	id: string,
): Promise<NomenclatureEditData | null> {
	const nomenclature = await prisma.nomenclature.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			modelArticle: true,
			color: true,
			GTIN: true,
			configurations: true,
			codePacks: {
				include: { codes: true },
			},
		},
	});

	if (!nomenclature) return null;

	const transformed = {
		id: nomenclature.id,
		name: nomenclature.name,
		modelArticle: nomenclature.modelArticle || "",
		color: nomenclature.color || "",
		GTIN: nomenclature.GTIN || "",
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
			content: codesToCsv(pack.codes.map((code) => code.value)),
			codes: pack.codes.map((code) => code.value),
		})),
	};

	return transformed;
}

export async function createNomenclature(data: NomenclatureFormData) {
	const { name, modelArticle, color, configurations, codes, gtinSize } = data;

	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true, companyId: true },
	});
	if (!user) return { success: false, error: "Пользователь не найден" };
	if (!user.companyId)
		return { success: false, error: "Не установлен ID компании" };

	const { companyId } = user;

	const configCreateData =
		configurations?.map((cfg) => ({
			pieceInPack: cfg.value.pieceInPack,
			packInPallet: cfg.value.packInPallet,
		})) ?? [];

	// Step 1: Start transaction
	try {
		const newNomenclature = await prisma.$transaction(async (tx) => {
			// Step 2: Create nomenclature first
			const createdNomenclature = await tx.nomenclature.create({
				data: {
					name,
					modelArticle,
					color,
					companyId,
					configurations: { create: configCreateData },
				},
			});

			// Step 3: Create or get SizeGtin records
			const sizeGtinMap = new Map<
				string,
				{ id: string; gtin: string; size: number }
			>();

			for (const { GTIN, size } of gtinSize || []) {
				const parsedSize = Number.parseInt(size);
				if (Number.isNaN(parsedSize)) continue;
				const existing = await tx.sizeGtin.findUnique({
					where: {
						gtin: GTIN,
					},
				});

				if (existing) {
					throw new Error(
						`GTIN ${GTIN} и ${parsedSize} размер уже используются.`,
					);
				}

				const created = await tx.sizeGtin.create({
					data: {
						gtin: GTIN,
						size: parsedSize,
						nomenclatureId: createdNomenclature.id,
					},
				});

				sizeGtinMap.set(GTIN, created);
			}
			// Step 4: Prepare code packs
			const codePackCreateData: ProcessedCodeFile[] = [];

			if (codes) {
				for (const fileObj of codes) {
					const codesArray = parseAndValidateCsvCodes(
						fileObj.content,
						fileObj.fileName,
					);
					await checkExistingCodes(prisma, codesArray, fileObj.fileName);

					try {
						const codePackData = await processCodeFile(fileObj);
						const gtinMatch = Array.from(sizeGtinMap.keys()).find((gtin) =>
							fileObj.GTIN.includes(gtin),
						);

						if (gtinMatch) {
							const sizeGtin = sizeGtinMap.get(gtinMatch);
							if (sizeGtin) {
								(codePackData as any).sizeGtinId = sizeGtin.id;
							}
						}

						(codePackData as any).nomenclatureId = createdNomenclature.id;

						codePackCreateData.push(codePackData);
					} catch (err: unknown) {
						if (err instanceof Error) {
							throw new Error("Ошибка обработки файла");
						}
					}
				}
			}

			// Step 5: Create codePacks (linked to nomenclature + sizeGtin)
			for (const codePack of codePackCreateData) {
				await tx.codePack.create({ data: codePack });
			}

			// Step 6: Return full object with included relations
			return tx.nomenclature.findUnique({
				where: { id: createdNomenclature.id },
				include: {
					configurations: true,
					codePacks: { include: { codes: true, sizeGtin: true } },
					sizeGtin: true,
				},
			});
		});

		return { success: true, data: newNomenclature };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Неизвестная ошибка сервера" };
	}
}

export async function updateNomenclature(data: NomenclatureEditData) {
	try {
		const { id, name, modelArticle, color, configurations, codes, gtinSize } =
			data;

		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return { success: false, error: "Не авторизован" };
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { role: true, companyId: true },
		});
		if (!user?.companyId) {
			return { success: false, error: "Не установлен ID компании" };
		}

		await prisma.nomenclature.update({
			where: { id },
			data: { name, modelArticle, color },
		});

		await syncSizeGtin(id, gtinSize);
		await syncConfigurations(id, configurations);
		await syncCodePacks(id, codes);

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Неизвестная ошибка сервера" };
	}
}
