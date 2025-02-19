import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();

  // Extract the basic nomenclature field.
  const name = formData.get("name") as string;
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Parse configurations JSON.
  const configurationsJson = formData.get("configurations") as string;
  let configurations: { peaceInPack: number; packInPallet: number }[] = [];
  try {
    configurations = JSON.parse(configurationsJson);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid configurations JSON" },
      { status: 400 },
    );
  }

  // Parse codes JSON.
  const codesJson = formData.get("codes") as string;
  let codes: { fileName: string; content: string }[] = [];
  try {
    codes = JSON.parse(codesJson);
  } catch (err) {
    return NextResponse.json({ error: "Invalid codes JSON" }, { status: 400 });
  }

  // Map configurations to the shape expected by Prisma.
  // Note: Our form sends "peaceInPack", but our model expects "pieceInPack".
  const configCreateData = configurations.map((cfg) => ({
    pieceInPack: cfg.peaceInPack, // mapping peaceInPack → pieceInPack
    packInPallet: cfg.packInPallet,
  }));

  // Prepare CodePack creation data if any codes were provided.
  let codePackCreateData = [];
  if (codes.length > 0) {
    // Generate a unique name for the CodePack.
    const codePackName = `CP-${Date.now()}`;
    // For each uploaded code file, parse its CSV content (assuming one code per row)
    const codeRecords = codes.flatMap((file) => {
      // Split content into rows, trim, and remove empty rows.
      const rows = file.content
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
      return rows.map((codeValue) => ({ value: codeValue }));
    });
    codePackCreateData.push({
      name: codePackName,
      codes: {
        create: codeRecords,
      },
    });
  }

  try {
    const newNomenclature = await prisma.nomenclature.create({
      data: {
        name,
        // Create nested Configuration records.
        configurations: {
          create: configCreateData,
        },
        // If there are codes, create a nested CodePack record with nested Code records.
        codePacks: {
          create: codePackCreateData,
        },
      },
      include: {
        configurations: true,
        codePacks: {
          include: {
            codes: true,
          },
        },
      },
    });

    return NextResponse.json(newNomenclature);
  } catch (error) {
    console.error("Error creating nomenclature:", error);
    return NextResponse.json(
      { error: "Failed to create nomenclature" },
      { status: 500 },
    );
  }
}
