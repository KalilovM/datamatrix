import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import {
	checkExistingCodes,
	parseAndValidateCsvCodes,
	processCodeFile,
} from "../lib/helpers";
import type { ProcessedCodeFile } from "./types";

export async function syncSizeGtin(nomenclatureId: string, gtinSize: any[]) {
	if (!gtinSize || gtinSize.length === 0 || !gtinSize.GTIN) {
		return;
	}
	const existingSizeGtin = await prisma.sizeGtin.findMany({
		where: { gtin: gtinSize.GTIN },
		select: { id: true, size: true, gtin: true },
	});

	const incomingMap = new Map<
		string,
		{ id?: string; size: number; gtin: string }
	>();
	for (const { id, size, GTIN } of gtinSize || []) {
		const parsedSize = Number.parseInt(size);
		if (!Number.isNaN(parsedSize)) {
			incomingMap.set(id || `${parsedSize}_${GTIN}`, {
				id,
				size: parsedSize,
				gtin: GTIN,
			});
		}
	}

	const toDelete = existingSizeGtin.filter(
		(existing) => ![...incomingMap.values()].some((i) => i.id === existing.id),
	);

	const toUpdate = incomingMap.values();

	for (const item of toUpdate) {
		if (item.id) {
			const existing = existingSizeGtin.find((sg) => sg.id === item.id);
			if (!existing) continue;

			const isChanged =
				existing.gtin !== item.gtin || existing.size !== item.size;

			if (isChanged) {
				// ✅ Check manually for GTIN+size duplicate in other records
				const duplicate = await prisma.sizeGtin.findFirst({
					where: {
						nomenclatureId,
						gtin: item.gtin,
						size: item.size,
						NOT: { id: item.id },
					},
					select: { id: true },
				});

				if (duplicate) {
					throw new Error(
						`GTIN (${item.gtin}) с размером ${item.size} уже существует.`,
					);
				}

				await prisma.sizeGtin.update({
					where: { id: item.id },
					data: {
						gtin: item.gtin,
						size: item.size,
					},
				});
			}
		} else {
			try {
				await prisma.sizeGtin.create({
					data: {
						size: item.size,
						gtin: item.gtin,
						nomenclatureId,
					},
				});
			} catch (err) {
				if (
					err instanceof Prisma.PrismaClientKnownRequestError &&
					err.code === "P2002"
				) {
					throw new Error(
						`GTIN (${item.gtin}) с размером ${item.size} уже существует.`,
					);
				}
				throw err;
			}
		}
	}

	for (const sg of toDelete) {
		const codePacks = await prisma.codePack.findMany({
			where: { sizeGtinId: sg.id },
			select: { id: true },
		});
		const codePackIds = codePacks.map((cp) => cp.id);

		await prisma.code.deleteMany({
			where: { codePackId: { in: codePackIds } },
		});
		await prisma.codePack.deleteMany({ where: { id: { in: codePackIds } } });
		await prisma.sizeGtin.delete({ where: { id: sg.id } });
	}
}

export async function syncConfigurations(
	nomenclatureId: string,
	configurations: any[],
) {
	const existing = await prisma.configuration.findMany({
		where: { nomenclatureId },
	});

	const incomingIds = configurations.filter((c) => c.id).map((c) => c.id);
	const toDelete = existing.filter((e) => !incomingIds.includes(e.id));

	for (const config of toDelete) {
		await prisma.generatedCodePack.deleteMany({
			where: { configurationId: config.id },
		});
		await prisma.configuration.delete({ where: { id: config.id } });
	}

	for (const config of configurations) {
		if (config.id) {
			await prisma.configuration.update({
				where: { id: config.id },
				data: config.value,
			});
		} else {
			await prisma.configuration.create({
				data: {
					...config.value,
					nomenclatureId,
					basePiece: 1,
				},
			});
		}
	}
}

export async function syncCodePacks(nomenclatureId: string, codes: any[]) {
	const existingCodePacks = await prisma.codePack.findMany({
		where: { nomenclatureId },
	});

	const sizeGtinList = await prisma.sizeGtin.findMany({
		where: { nomenclatureId },
		select: { id: true, size: true, gtin: true },
	});

	const incomingNames = codes.map((c) => c.fileName);
	const toDelete = existingCodePacks.filter(
		(cp) => !incomingNames.includes(cp.name),
	);

	for (const pack of toDelete) {
		await prisma.code.deleteMany({ where: { codePackId: pack.id } });
		await prisma.codePack.delete({ where: { id: pack.id } });
		await prisma.generatedCodePack.deleteMany({ where: { nomenclatureId } });
	}

	for (const code of codes) {
		const codesArray = parseAndValidateCsvCodes(code.content, code.fileName);
		await checkExistingCodes(prisma, codesArray, code.fileName, nomenclatureId);
		const newCodePackData: ProcessedCodeFile = await processCodeFile(code);

		const linkedSizeGtin = sizeGtinList.find(
			(sg) => sg.gtin === code.GTIN && sg.size === Number(code.size),
		);

		if (code.id) {
			await prisma.codePack.update({
				where: { id: code.id },
				data: {
					name: code.fileName,
					content: code.content,
					sizeGtinId: linkedSizeGtin?.id ?? null,
				},
			});
		} else {
			await prisma.codePack.create({
				data: {
					nomenclatureId,
					name: newCodePackData.name,
					content: newCodePackData.content,
					codes: newCodePackData.codes,
					sizeGtinId: linkedSizeGtin?.id ?? null,
				},
			});
		}
	}
}
