import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";

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

export async function checkExistingCodes(
  codes: string[],
  fileName: string,
): Promise<void> {
  const existingCodes = await prisma.code.findMany({
    where: { value: { in: codes } },
    select: { value: true },
  });
  if (existingCodes.length > 0) {
    throw new Error(`Коды в файле ${fileName} уже существуют в БД`);
  }
  const existingCodePacks = await prisma.codePack.findMany({
    where: { name: fileName },
    select: { name: true },
  });
  if (existingCodePacks.length > 0) {
    throw new Error(`Файл ${fileName} уже загружен`);
  }
}

export async function processCodeFile(fileObj: {
  fileName: string;
  content: string;
}): Promise<any> {
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
  };
}
