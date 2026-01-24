import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const generatedCode = await prisma.generatedCodePack.findUnique({
    where: { id },
    select: {
      codes: {
        select: {
          value: true,
        },
      },
      nomenclature: {
        select: {
          name: true,
          modelArticle: true,
          color: true,
          sizeGtin: {
            select: {
              size: true,
              gtin: true,
            },
          },
        },
      },
    },
  });

  if (!generatedCode) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(generatedCode);
}
