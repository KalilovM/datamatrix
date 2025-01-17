import { cookies } from 'next/headers';

export async function getCodePacks(nomenclatureId: string) {
  const response = await fetch(
    `${process.env.NEXT_API_URL}/api/nomenclature/${nomenclatureId}/codepacks`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch code packs');
  }

  const data = await response.json();
  console.log(data);
  return data;
}
