'use server';
import { cookies } from 'next/headers';

export async function saveNomenclatureName(
  nomenclatureId: string,
  formData: FormData,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_API_URL}/api/nomenclature/${nomenclatureId}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: (await cookies()).toString(),
        },
        body: JSON.stringify({ name: formData.get('name') }),
      },
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (e: unknown) {
    console.error('Failed to save nomenclature name', e);
  }
}
