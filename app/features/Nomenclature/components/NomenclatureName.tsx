'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveNomenclatureName } from './actions/saveNomenclatureName';

interface NomenclatureNameProps {
  nameValue: string;
  nomenclatureId: string;
}

export default function NomenclatureName({
  nameValue,
  nomenclatureId,
}: NomenclatureNameProps) {
  const [name, setName] = useState(nameValue);
  const updateNomenclature = saveNomenclatureName.bind(null, nomenclatureId);
  return (
    <form
      action={updateNomenclature}
      className="flex w-full flex-row gap-8 rounded-2xl border border-blue-300 bg-white px-4 py-4"
    >
      <div className="flex w-full flex-col">
        <label htmlFor="name" className="text-neutral-600">
          Наименование
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        />
      </div>
      <div className="flex w-full flex-row items-center justify-end gap-2.5">
        <Link
          href="/nomenclature"
          className="rounded-lg bg-neutral-600 px-4 py-2 text-white hover:bg-neutral-700"
        >
          Отмена
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}
