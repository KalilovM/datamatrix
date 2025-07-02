import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

function normalizeScannerInput(raw: string): string {
  // Add FNC1 at the start if missing (using the actual binary character)
  let normalized = raw;
  if (!normalized.startsWith("\x1D") && !normalized.startsWith("")) {
    normalized = "\x1D" + normalized;
  }
  normalized = normalized.replace(/(91[\w\d]{2})/g, "\x1D$1");
  normalized = normalized.replace(/(92[\w\d]+)/g, "\x1D$1");

  normalized = normalized.replace(/(\x1D){2,}/g, "\x1D");
  return `�${normalized}`;
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Введите код!" }, { status: 400 });
    }

    // Check if it's a UUID (aggregated code)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isAggregatedCode = uuidRegex.test(code);

    if (isAggregatedCode) {
      // Search in GeneratedCodePack table first
      let aggregatedCode = await prisma.generatedCodePack.findUnique({
        where: { value: code },
        select: {
          value: true,
          nomenclature: true,
          codes: {
            select: { value: true },
          },
        },
      });

      // If not found in packs, search in pallets
      if (!aggregatedCode) {
        const pallet = await prisma.generatedCodePallet.findUnique({
          where: { value: code },
          select: {
            value: true,
            nomenclature: true,
            generatedCodePacks: {
              select: {
                codes: {
                  select: { value: true },
                },
              },
            },
          },
        });

        if (pallet) {
          // Flatten all codes from all packs in the pallet
          const allCodes = pallet.generatedCodePacks.flatMap((pack) => pack.codes);
          aggregatedCode = {
            value: pallet.value,
            nomenclature: pallet.nomenclature,
            codes: allCodes,
          };
        }
      }

      if (aggregatedCode) {
        return NextResponse.json({
          generatedCodePack: {
            generatedCodePack: aggregatedCode.value || "",
            codes: aggregatedCode.codes || [],
            nomenclature: aggregatedCode.nomenclature || null,
          },
        });
      }
    } else {
      // Search in regular codes table (datamatrix codes)
      const formatted = normalizeScannerInput(code);
      const pack = await prisma.code.findUnique({
        where: { value: formatted },
        select: {
          value: true,
          generatedCodePack: {
            select: {
              value: true,
              nomenclature: true,
              codes: {
                select: { value: true },
              },
            },
          },
        },
      });

      if (pack) {
        return NextResponse.json({
          generatedCodePack: {
            generatedCodePack: pack.generatedCodePack?.value || "",
            codes: pack.generatedCodePack?.codes || [],
            nomenclature: pack.generatedCodePack?.nomenclature || null,
          },
        });
      }
    }

    return NextResponse.json({ error: "Код не найден. Проверьте правильность ввода." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера. Попробуйте позже." }, { status: 500 });
  }
}
