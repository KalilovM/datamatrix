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
	const { name, modelArticle, color, GTIN, configurations, codes } = data;
	console.log(codes);

	// Get current user session.
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
		throw new Error("Пользователь не найден");
	}
	if (!user?.companyId) {
		throw new Error("Не установлен ID компании");
	}
	const { companyId } = user;

	// Map configurations to the shape expected by Prisma.
	const configCreateData = configurations
		? configurations.map((cfg) => ({
				pieceInPack: cfg.value.pieceInPack,
				packInPallet: cfg.value.packInPallet,
			}))
		: [];

	// Process each code file using the helper functions.
	const codePackCreateData: ProcessedCodeFile[] = [];
	if (codes) {
		for (const fileObj of codes) {
			// Parse codes from the CSV content to check for duplicates.
			// NOTE: This duplicates the parsing inside processCodeFile.
			const codesArray = parseAndValidateCsvCodes(
				fileObj.content,
				fileObj.fileName,
			);

			// Check for duplicates in both codes and code packs.
			await checkExistingCodes(prisma, codesArray, fileObj.fileName);

			try {
				// Process the file (which includes re-parsing the CSV).
				const codePackData = await processCodeFile(fileObj);
				codePackCreateData.push(codePackData);
			} catch (err: unknown) {
				console.error(`Ошибка обработки файла ${fileObj.fileName}:`, err);
				if (err instanceof Error) {
					throw new Error("Ошибка обработки файла");
				}
			}
		}
	}

	try {
		// Wrap the creation in a transaction.
		const newNomenclature = await prisma.$transaction(async (tx) => {
			return await tx.nomenclature.create({
				data: {
					name,
					modelArticle,
					color,
					GTIN,
					companyId,
					configurations: { create: configCreateData },
					codePacks: { create: codePackCreateData },
				},
				include: {
					configurations: true,
					codePacks: { include: { codes: true } },
				},
			});
		});

		return newNomenclature;
	} catch (error: unknown) {
		console.error("Ошибка создания номенклатуры:", error);
		throw new Error("Ошибка создания номенклатуры");
	}
}

export async function updateNomenclature(data: NomenclatureEditData) {
	const { id, name, modelArticle, color, GTIN, configurations, codes } = data;

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
		throw new Error("Пользователь не найден");
	}
	if (!user?.companyId) {
		throw new Error("Не установлен ID компании");
	}
	const { companyId } = user;

	try {
		const updatedNomenclature = await prisma.$transaction(async (tx) => {
			// Delete existing configurations and code packs for this nomenclature.
			await tx.configuration.deleteMany({ where: { nomenclatureId: id } });
			await tx.codePack.deleteMany({ where: { nomenclatureId: id } });

			// Prepare new code pack data.
			const newCodePackData: ProcessedCodeFile[] = [];
			if (codes) {
				for (const fileObj of codes) {
					// Parse codes from the CSV content.
					const codesArray = parseAndValidateCsvCodes(
						fileObj.content,
						fileObj.fileName,
					);

					// Use the transaction client and tell the helper to ignore codes from the current nomenclature.
					await checkExistingCodes(tx, codesArray, fileObj.fileName, id);

					try {
						// Process the file (which may re-parse the CSV internally).
						const codePackData = await processCodeFile(fileObj);
						newCodePackData.push(codePackData);
					} catch (err: unknown) {
						console.error(`Ошибка обработки файла ${fileObj.fileName}:`, err);
						if (err instanceof Error) {
							throw new Error("Ошибка обработки файла");
						}
					}
				}
			}

			// Update the nomenclature's top-level fields and recreate nested relations.
			return await tx.nomenclature.update({
				where: { id },
				data: {
					name,
					modelArticle,
					color,
					GTIN,
					companyId,
					configurations: {
						create: configurations
							? configurations.map((cfg) => ({
									pieceInPack: cfg.value.pieceInPack,
									packInPallet: cfg.value.packInPallet,
								}))
							: [],
					},
					codePacks: {
						create: newCodePackData,
					},
				},
				include: {
					configurations: true,
					codePacks: { include: { codes: true } },
				},
			});
		});

		return updatedNomenclature;
	} catch (error: unknown) {
		console.error("Ошибка обновления номенклатуры:", error);
		throw new Error("Ошибка обновления номенклатуры");
	}
}
