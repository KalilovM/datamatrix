'use server';
import { cookies } from 'next/headers';

export async function getNomenclature(id: string) {
  const response = await fetch(
    `${process.env.NEXT_API_URL}/api/nomenclature/${id}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch nomenclature');
  }

  return await response.json();
}
