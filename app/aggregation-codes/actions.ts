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
      nomenclature: { select: { name: true } },
      configuration: { select: { pieceInPack: true, packInPallet: true } },
    },
  });

  // Fetch pallets
  const pallets = await prisma.generatedCodePallet.findMany({
    where: { nomenclature: { companyId } },
    include: {
      nomenclature: { select: { name: true } },
      configuration: { select: { pieceInPack: true, packInPallet: true } },
    },
  });

  // Format packs
  const formattedPacks = packs.map((pack) => ({
    name: pack.nomenclature.name,
    generatedCode: pack.value,
    configuration: `1-${pack.configuration.pieceInPack}-${
      pack.configuration.packInPallet
    }`,
    type: "Pack",
    createdAt: pack.createdAt,
  }));

  // Format pallets
  const formattedPallets = pallets.map((pallet) => ({
    name: pallet.nomenclature.name,
    generatedCode: pallet.value,
    configuration: `1-${pallet.configuration.pieceInPack}-${
      pallet.configuration.packInPallet
    }`,
    type: "Pallet",
    createdAt: pallet.createdAt,
  }));

  return [...formattedPacks, ...formattedPallets].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}
