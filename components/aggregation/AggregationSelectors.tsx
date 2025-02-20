"use client";

import React, { useState } from "react";
import Select from "react-select";
import { NomenclatureOption } from "./AggregationForm";

interface AggregationSelectorsProps {
  options: NomenclatureOption[] | null;
  onConfigurationSelect: (
    selectedConfig: { pieceInPack: number; packInPallet: number } | null,
  ) => void;
}

export default function AggregationSelectors({
  options,
  onConfigurationSelect,
}: AggregationSelectorsProps) {
  const [selectedNomenclature, setSelectedNomenclature] = useState<any>(null);
  const [selectedConfiguration, setSelectedConfiguration] = useState<any>(null);

  // Build options for the nomenclature select
  const nomenclatureOptions = options
    ? options.map((nom) => ({
        label: nom.name || "Без имени",
        value: nom,
      }))
    : [];

  // When a nomenclature is selected, its configurations will be used for the configuration select.
  const configurationOptions = selectedNomenclature
    ? selectedNomenclature.value.configurations.map(
        (
          config: { pieceInPack: number; packInPallet: number },
          index: number,
        ) => ({
          label: `Пачек: ${config.pieceInPack}, Паллет: ${config.packInPallet}`,
          value: config,
        }),
      )
    : [];

  const handleNomenclatureChange = (option: any) => {
    setSelectedNomenclature(option);
    // Reset configuration select if nomenclature changes.
    setSelectedConfiguration(null);
    onConfigurationSelect(null);
  };

  const handleConfigurationChange = (option: any) => {
    setSelectedConfiguration(option);
    onConfigurationSelect(option ? option.value : null);
  };

  return (
    <div className="gap-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="leading-6 text-xl font-bold">Агрегация</h1>
      </div>
      <div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-between items-center gap-4">
        <div className="flex flex-row w-full gap-4">
          {/* Номенклатура Select */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="nomenclature" className="block">
              Номенклатура
            </label>
            <Select
              options={nomenclatureOptions}
              value={selectedNomenclature}
              onChange={handleNomenclatureChange}
              placeholder="Выберите номенклатуру"
            />
          </div>
          {/* Конфигурация Select */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="configuration" className="block">
              Конфигурация
            </label>
            <Select
              options={configurationOptions}
              value={selectedConfiguration}
              onChange={handleConfigurationChange}
              placeholder="Выберите конфигурацию"
              isDisabled={!selectedNomenclature}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
