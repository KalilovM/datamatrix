'use server';

import { cookies } from 'next/headers';

export async function uploadCodePacks(
  nomenclatureId: string,
  formData: FormData,
) {
  console.log('formData', formData);
  const response = await fetch(
    `${process.env.NEXT_API_URL}/api/nomenclature/${nomenclatureId}/codepacks`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        Cookie: (await cookies()).toString(),
      },
      body: formData,
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch code packs');
  }

  const data = await response.json();
  console.log(data);
  return data;
}
