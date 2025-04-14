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
	const { name, modelArticle, color, configurations, codes, gtinSize } = data;

	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true, companyId: true },
	});
	if (!user) throw new Error("Пользователь не найден");
	if (!user.companyId) throw new Error("Не установлен ID компании");

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

				let existing = await tx.sizeGtin.findUnique({
					where: {
						size_gtin: { size: parsedSize, gtin: GTIN },
					},
				});

				if (!existing) {
					existing = await tx.sizeGtin.create({
						data: {
							gtin: GTIN,
							size: parsedSize,
							nomenclatureId: createdNomenclature.id,
						},
					});
				}

				sizeGtinMap.set(GTIN, existing);
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
						console.log(fileObj);
						const gtinMatch = Array.from(sizeGtinMap.keys()).find((gtin) =>
							fileObj.GTIN.includes(gtin),
						);
						console.log(gtinMatch);

						if (gtinMatch) {
							const sizeGtin = sizeGtinMap.get(gtinMatch);
							console.log(sizeGtin);
							if (sizeGtin) {
								(codePackData as any).sizeGtinId = sizeGtin.id;
							}
						}

						(codePackData as any).nomenclatureId = createdNomenclature.id;

						codePackCreateData.push(codePackData);
					} catch (err: unknown) {
						console.error(`Ошибка обработки файла ${fileObj.fileName}:`, err);
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

		return newNomenclature;
	} catch (error: unknown) {
		console.error("Ошибка создания номенклатуры:", error);
		throw new Error("Ошибка создания номенклатуры");
	}
}

export async function updateNomenclature(data: NomenclatureEditData) {
	const { id, name, modelArticle, color, configurations, codes, gtinSize } =
		data;

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

	// === SIZE GTIN ===
	const existingSizeGtin = await prisma.sizeGtin.findMany({
		where: { nomenclatureId: id },
		select: { id: true, size: true, gtin: true },
	});

	const incomingGtinMap = new Map<string, { size: number; gtin: string }>();
	for (const { size, GTIN } of gtinSize || []) {
		const parsedSize = Number.parseInt(size);
		if (!Number.isNaN(parsedSize)) {
			incomingGtinMap.set(`${parsedSize}_${GTIN}`, {
				size: parsedSize,
				gtin: GTIN,
			});
		}
	}

	// Identify SizeGtin entries to delete
	const toDelete = existingSizeGtin.filter(
		(existing) => !incomingGtinMap.has(`${existing.size}_${existing.gtin}`),
	);

	// Identify SizeGtin entries to create
	const toCreate: { size: number; gtin: string }[] = [];
	for (const [key, { size, gtin }] of incomingGtinMap) {
		const exists = existingSizeGtin.find(
			(sg) => sg.size === size && sg.gtin === gtin,
		);
		if (!exists) {
			toCreate.push({ size, gtin });
		}
	}

	// Delete removed SizeGtin records and all linked CodePacks and Codes
	for (const sg of toDelete) {
		// Get related codePacks to delete their codes
		const linkedCodePacks = await prisma.codePack.findMany({
			where: { sizeGtinId: sg.id },
			select: { id: true },
		});

		const codePackIds = linkedCodePacks.map((cp) => cp.id);

		// Delete codes first
		await prisma.code.deleteMany({
			where: { codePackId: { in: codePackIds } },
		});

		// Delete codePacks
		await prisma.codePack.deleteMany({
			where: { id: { in: codePackIds } },
		});

		// Delete the SizeGtin entry itself
		await prisma.sizeGtin.delete({ where: { id: sg.id } });
	}

	// Create new SizeGtin entries
	for (const item of toCreate) {
		await prisma.sizeGtin.create({
			data: {
				size: item.size,
				gtin: item.gtin,
				nomenclatureId: id,
			},
		});
	}

	try {
		await prisma.nomenclature.update({
			where: { id },
			data: {
				name,
				modelArticle,
				color,
			},
		});

		// === CONFIGURATIONS ===
		const existingConfigurations = await prisma.configuration.findMany({
			where: { nomenclatureId: id },
		});
		let incomingConfigIds: string[] = [];
		if (configurations) {
			incomingConfigIds = configurations
				.filter((conf) => conf.id)
				.map((conf) => conf.id);
		}

		const configsToDelete = existingConfigurations.filter(
			(existing) => !incomingConfigIds.includes(existing.id),
		);

		for (const config of configsToDelete) {
			await prisma.generatedCodePack.deleteMany({
				where: { configurationId: config.id },
			});
			await prisma.configuration.delete({
				where: { id: config.id },
			});
		}

		// === CODE PACKS ===
		const existingCodePacks = await prisma.codePack.findMany({
			where: { nomenclatureId: id },
		});

		let incomingFileNames: string[] = [];
		if (codes) {
			incomingFileNames = codes
				.filter((code) => code.fileName)
				.map((code) => code.fileName);
		}

		const codePacksToDelete = existingCodePacks.filter(
			(cp) => !incomingFileNames.includes(cp.name),
		);

		for (const pack of codePacksToDelete) {
			await prisma.code.deleteMany({
				where: { codePackId: pack.id },
			});
			await prisma.codePack.delete({
				where: { id: pack.id },
			});

			await prisma.generatedCodePack.deleteMany({
				where: { nomenclatureId: id },
			});
		}

		// ✅ Sync updated & new configurations
		for (const config of configurations) {
			if (config.id) {
				await prisma.configuration.update({
					where: { id: config.id },
					data: {
						pieceInPack: config.value.pieceInPack,
						packInPallet: config.value.packInPallet,
					},
				});
			} else {
				await prisma.configuration.create({
					data: {
						nomenclatureId: id,
						basePiece: 1,
						pieceInPack: config.value.pieceInPack,
						packInPallet: config.value.packInPallet,
					},
				});
			}
		}

		for (const code of codes) {
			let newCodePackData: ProcessedCodeFile | null = null;
			const codesArray = parseAndValidateCsvCodes(code.content, code.fileName);

			await checkExistingCodes(prisma, codesArray, code.fileName, id);
			try {
				const codePackData = await processCodeFile(code);
				newCodePackData = codePackData;
			} catch (err: unknown) {
				console.error(`Ошибка обработки файла ${code.fileName}:`, err);
				if (err instanceof Error) {
					throw new Error("Ошибка обработки файла");
				}
			}

			if (code.id) {
				await prisma.codePack.update({
					where: { id: code.id },
					data: {
						name: code.fileName,
						content: code.content,
					},
				});
			} else {
				if (newCodePackData) {
					await prisma.codePack.create({
						data: {
							nomenclatureId: id,
							name: newCodePackData.name,
							content: newCodePackData.content,
							codes: newCodePackData.codes,
						},
					});
				}
			}
		}
	} catch (error: unknown) {
		console.error("Ошибка обновления номенклатуры:", error);
		throw new Error("Ошибка обновления номенклатуры");
	}
}
