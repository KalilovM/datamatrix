import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { processCodeFile } from "../helpers";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const nomenclatureId = (await params).id;
  const formData = await req.formData();

  // Extract basic nomenclature fields.
  const name = formData.get("name") as string;
  const modelArticle = formData.get("modelArticle") as string;
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;

  // Validate basic required fields.
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
  // Map to the shape expected by the DB (note: converting "peaceInPack" to "pieceInPack")
  const configCreateData = configurations.map((cfg) => ({
    pieceInPack: cfg.peaceInPack,
    packInPallet: cfg.packInPallet,
  }));

  // Parse new codes (if any). Expecting a JSON string representing an array of objects:
  // [{ fileName: string, content: string }, ... ]
  let codes: { fileName: string; content: string }[] = [];
  const codesFieldRaw = formData.get("codes") as string;
  if (codesFieldRaw) {
    try {
      codes = JSON.parse(codesFieldRaw);
    } catch (err) {
      return NextResponse.json(
        { error: "Неверный формат данных для кодов" },
        { status: 400 },
      );
    }
  }

  // Process each new code file using helper function.
  let codePackCreateData: any[] = [];
  for (const fileObj of codes) {
    try {
      const codePackData = await processCodeFile(fileObj);
      codePackCreateData.push(codePackData);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  // Parse codesToDelete: a JSON string with an array of IDs.
  let codesToDeleteArray: { fileName: string; content: string }[] = [];
  const codesToDeleteRaw = formData.get("codesToDelete") as string;
  if (codesToDeleteRaw) {
    try {
      codesToDeleteArray = JSON.parse(codesToDeleteRaw);
    } catch (err) {
      return NextResponse.json(
        { error: "Неверный формат данных для удаления кодов" },
        { status: 400 },
      );
    }
  }

  try {
    const updatedNomenclature = await prisma.$transaction(async (tx) => {
      // Update the nomenclature's basic fields.
      await tx.nomenclature.update({
        where: { id: nomenclatureId },
        data: {
          name,
          modelArticle,
          color,
          size,
        },
      });

      // For configurations, delete the existing ones and create new entries.
      await tx.configuration.deleteMany({
        where: { nomenclatureId },
      });
      if (configCreateData.length > 0) {
        await tx.configuration.createMany({
          data: configCreateData.map((cfg) => ({ ...cfg, nomenclatureId })),
        });
      }

      // Delete codePacks that were marked for deletion.
      if (codesToDeleteArray.length > 0) {
        await tx.codePack.deleteMany({
          where: {
            name: {
              in: codesToDeleteArray.map((code) => code.fileName),
            },
            nomenclatureId,
          },
        });
      }

      // Create new codePacks from the processed files.
      if (codePackCreateData.length > 0) {
        for (const newCodePack of codePackCreateData) {
          await tx.codePack.create({
            data: { ...newCodePack, nomenclatureId },
          });
        }
      }

      // Return the updated nomenclature with its relations.
      return await tx.nomenclature.findUnique({
        where: { id: nomenclatureId },
        include: {
          configurations: true,
          codePacks: { include: { codes: true } },
        },
      });
    });

    return NextResponse.json(updatedNomenclature);
  } catch (error) {
    console.error("Ошибка при обновлении номенклатуры:", error);
    return NextResponse.json(
      { error: "Не удалось обновить номенклатуру" },
      { status: 500 },
    );
  }
}
