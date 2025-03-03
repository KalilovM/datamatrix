import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getAggregatedCodes() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          company: { select: { id: true } },
        },
      },
    },
  });

  if (!user || !user.user.company) return [];

  const companyId = user.user.company.id;

  // Fetch packs
  const packs = await prisma.generatedCodePack.findMany({
    where: { nomenclature: { companyId } },
    include: {
      codes: {
        select: { value: true },
      },
      nomenclature: {
        select: { name: true, modelArticle: true, size: true, color: true },
      },
      configuration: { select: { pieceInPack: true, packInPallet: true } },
    },
  });

  // Fetch pallets
  const pallets = await prisma.generatedCodePallet.findMany({
    where: { nomenclature: { companyId } },
    include: {
      nomenclature: {
        select: { name: true, modelArticle: true, size: true, color: true },
      },
      configuration: { select: { pieceInPack: true, packInPallet: true } },
    },
  });

  // Format packs
  const formattedPacks = packs.map((pack) => ({
    name: pack.nomenclature.name,
    modelArticle: pack.nomenclature.modelArticle,
    size: pack.nomenclature.size,
    color: pack.nomenclature.color,
    generatedCode: pack.value,
    configuration: `1-${pack.configuration.pieceInPack}-${
      pack.configuration.packInPallet
    }`,
    codes: pack.codes.map((code) => code.value),
    type: "Пачка",
    createdAt: pack.createdAt,
  }));

  // Format pallets
  const formattedPallets = pallets.map((pallet) => ({
    name: pallet.nomenclature.name,
    modelArticle: pallet.nomenclature.modelArticle,
    size: pallet.nomenclature.size,
    color: pallet.nomenclature.color,
    generatedCode: pallet.value,
    configuration: `1-${pallet.configuration.pieceInPack}-${
      pallet.configuration.packInPallet
    }`,
    type: "Паллет",
    createdAt: pallet.createdAt,
  }));

  return [...formattedPacks, ...formattedPallets].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export async function getDefaultPrintTemplate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          company: { select: { id: true } },
        },
      },
    },
  });

  if (!user || !user.user.company) return [];

  const companyId = user.user.company.id;

  return await prisma.printingTemplate.findFirst({
    where: { companyId, isDefault: true },
    include: {
      fields: true,
    },
  });
}
