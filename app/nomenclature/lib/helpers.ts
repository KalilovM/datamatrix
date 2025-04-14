import type { Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";
import type { ProcessedCodeFile } from "../model/types";

export function parseAndValidateCsvCodes(
	csvText: string,
	fileName: string,
): string[] {
	const rows: string[][] = parse(csvText, {
		delimiter: ",",
		columns: false,
		skip_empty_lines: true,
	});
	const trimmedCodes = rows
		.flat()
		.map((code: string) => code.trim())
		.filter((code: string) => code.length > 0);

	// Check for duplicates within the file.
	const duplicatesInFile = trimmedCodes.filter(
		(code: string, index: number) => trimmedCodes.indexOf(code) !== index,
	);
	if (duplicatesInFile.length > 0) {
		throw new Error(`В файле ${fileName} найдены дубликаты кодов`);
	}
	return trimmedCodes;
}

export function codesToCsv(codes: string[]): string {
	return codes
		.map((code) => {
			if (code.includes(",") || code.includes('"') || code.includes("\n")) {
				const escaped = code.replace(/"/g, '""');
				return `"${escaped}"`;
			}
			return code;
		})
		.join(",");
}

export async function checkExistingCodes(
	client: Prisma.TransactionClient,
	codes: string[],
	fileName: string,
	ignoreNomenclatureId?: string,
): Promise<void> {
	const existingCodes = await client.code.findMany({
		where: {
			value: { in: codes },
			...(ignoreNomenclatureId && {
				codePack: { nomenclatureId: { not: ignoreNomenclatureId } },
			}),
		},
		select: { value: true },
	});
	if (existingCodes.length > 0) {
		throw new Error(`Коды в файле ${fileName} уже существуют в БД`);
	}

	const existingCodePacks = await client.codePack.findMany({
		where: {
			name: fileName,
			...(ignoreNomenclatureId && {
				nomenclatureId: { not: ignoreNomenclatureId },
			}),
		},
		select: { name: true },
	});
	if (existingCodePacks.length > 0) {
		throw new Error(`Файл ${fileName} уже загружен`);
	}
}

export async function processCodeFile(fileObj: {
	fileName: string;
	content: string;
	size: string;
	GTIN: string;
}): Promise<ProcessedCodeFile> {
	const codes = parseAndValidateCsvCodes(fileObj.content, fileObj.fileName);

	// Decode codes using parseBarcode function
	const codeRecords = codes.map((codeValue: string) => {
		return {
			value: codeValue,
			formattedValue: codeValue.replace(/[^a-zA-Z0-9+=_]/g, ""),
		};
	});

	return {
		name: fileObj.fileName,
		codes: { create: codeRecords },
		content: fileObj.content,
	};
}
