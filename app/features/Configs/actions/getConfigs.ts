'use server';
import { cookies } from 'next/headers';

interface Config {
  id: string;
  pieceInPack: number;
  packInPallet: number;
}

export async function getConfigs(nomenclatureId: string) {
  const response = await fetch(
    `${process.env.NEXT_API_URL}/api/nomenclature/${nomenclatureId}/configs`,
    {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch configurations');
  }
  const data = await response.json();
  return data;
}

export async function getConfigOptions(nomenclatureId: string) {
  const response = await fetch(
    `${process.env.NEXT_API_URL}/api/nomenclature/${nomenclatureId}/configs`,
    {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch configuration options');
  }
  const data = await response.json();
  const formattedData = data.map((config: Config) => ({
    label: `1-${config.pieceInPack}-${config.packInPallet}`,
    value: {
      id: config.id,
      packCount: config.pieceInPack,
      palletCount: config.packInPallet,
    },
  }));
  return formattedData;
}
