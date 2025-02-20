import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { parse } from "csv-parse/sync";

export async function POST(request: Request) {
  const formData = await request.formData();
  const user = await getCurrentUser();
  if (!user?.companyId) {
    return NextResponse.json(
      { error: "Требуется наличие компании" },
      { status: 401 },
    );
  }

  // Extract basic nomenclature fields.
  const name = formData.get("name") as string;
  const modelArticle = formData.get("modelArticle") as string;
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;
  if (!name) {
    return NextResponse.json(
      { error: "Наименование обязательно" },
      { status: 400 },
    );
  }

  // Parse configurations JSON.
  const configurationsJson = formData.get("configurations") as string;
  let configurations: { peaceInPack: number; packInPallet: number }[] = [];
  try {
    configurations = JSON.parse(configurationsJson);
  } catch (err) {
    return NextResponse.json(
      { error: "Неверный формат JSON для конфигураций" },
      { status: 400 },
    );
  }

  // Parse codes from CSV.
  // Expecting the "codes" field to be a JSON string representing an array of objects:
  // [{ fileName: string, content: string }, ... ]
  const codesFieldRaw = formData.get("codes");
  let codes: { fileName: string; content: string }[] = [];
  if (typeof codesFieldRaw === "string") {
    try {
      codes = JSON.parse(codesFieldRaw);
    } catch (err) {
      return NextResponse.json(
        { error: "Неверный формат данных для кодов" },
        { status: 400 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Коды должны быть загружены в формате CSV" },
      { status: 400 },
    );
  }

  // For each uploaded file, parse its CSV content and create a code pack.
  let codePackCreateData: any[] = [];
  for (const fileObj of codes) {
    const csvText = fileObj.content;
    const rows: string[][] = parse(csvText, {
      delimiter: ",",
      columns: false,
      skip_empty_lines: true,
    });
    // Flatten, trim, and filter each row.
    const trimmed = rows
      .flat()
      .map((code: string) => code.trim())
      .filter((code: string) => code.length > 0);

    // Check for duplicates within this file.
    const duplicatesInFile = trimmed.filter(
      (code: string, index: number) => trimmed.indexOf(code) !== index,
    );
    if (duplicatesInFile.length > 0) {
      return NextResponse.json(
        { error: `В файле ${fileObj.fileName} найдены дубликаты кодов` },
        { status: 400 },
      );
    }

    // Check for duplicates in the database for codes from this file.
    const existingCodes = await prisma.code.findMany({
      where: { value: { in: trimmed } },
      select: { value: true },
    });
    // Check for unique codePack names for this file name.
    const existingCodePacks = await prisma.codePack.findMany({
      where: { name: fileObj.fileName },
      select: { name: true },
    });
    if (existingCodes.length > 0) {
      return NextResponse.json(
        { error: `Коды в файле ${fileObj.fileName} уже существуют в БД` },
        { status: 400 },
      );
    }

    if (existingCodePacks.length > 0) {
      return NextResponse.json(
        { error: `Файл ${fileObj.fileName} уже загружен` },
        { status: 400 },
      );
    }

    // Create code records from this file's rows.
    const codeRecords = trimmed.map((codeValue: string) => ({
      value: codeValue,
    }));
    codePackCreateData.push({
      name: fileObj.fileName, // set codepack name as the file name
      codes: { create: codeRecords },
    });
  }

  // Map configurations to the shape expected by Prisma.
  // Note: our form sends "peaceInPack", but our model expects "pieceInPack".
  const configCreateData = configurations.map((cfg) => ({
    pieceInPack: cfg.peaceInPack,
    packInPallet: cfg.packInPallet,
  }));

  try {
    // Wrap creation in a transaction. If any error occurs, the transaction will roll back.
    const newNomenclature = await prisma.$transaction(async (tx) => {
      return await tx.nomenclature.create({
        data: {
          name,
          modelArticle,
          color,
          size,
          companyId: user.companyId,
          configurations: { create: configCreateData },
          codePacks: { create: codePackCreateData },
        },
        include: {
          configurations: true,
          codePacks: {
            include: { codes: true },
          },
        },
      });
    });

    return NextResponse.json(newNomenclature);
  } catch (error) {
    console.error("Ошибка при создании номенклатуры:", error);
    return NextResponse.json(
      { error: "Не удалось создать номенклатуру" },
      { status: 500 },
    );
  }
}
