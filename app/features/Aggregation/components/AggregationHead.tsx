'use client';

import dynamic from 'next/dynamic';
import { createAgregatedCode } from '../actions/createAgregatedCode';
import { useState } from 'react';

const Select = dynamic(() => import('react-select'), { ssr: false });

interface AggregationHeadProps {
  nomenclatureOptions: Array<{ value: string; label: string }>;
  configOptions: Array<{ value: string; label: string }>;
}

export default function AggregationHead({
  nomenclatureOptions,
  configOptions,
}: AggregationHeadProps) {
  const [nomenclatureSelected, setNomenclatureSelected] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [configSelected, setConfigSelected] = useState<{
    value: string;
    label: string;
  } | null>(null);

  return (
    <form
      action={createAgregatedCode}
      className="flex w-full flex-row gap-8 rounded-2xl border border-blue-300 bg-white px-4 py-4"
    >
      <div className="flex w-full flex-col gap-2 pl-4 pr-8">
        <label htmlFor="nomenclature" className="text-neutral-600">
          Номенклатура
        </label>
        <Select
          id="nomenclature"
          instanceId="nomenclature-select"
          options={nomenclatureOptions}
          value={nomenclatureSelected}
          onChange={setNomenclatureSelected}
          placeholder="Выберите номенклатуру"
          classNamePrefix="react-select"
        />
      </div>

      <div className="flex w-full flex-col gap-2 pl-8 pr-4">
        <label htmlFor="config" className="text-neutral-600">
          Конфигурация
        </label>
        <Select
          id="config"
          instanceId="config-select"
          options={configOptions}
          value={configSelected}
          onChange={setConfigSelected}
          placeholder="Выберите конфигурацию"
          classNamePrefix="react-select"
        />
      </div>
    </form>
  );
}
