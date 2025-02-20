"use client";

import React, { useState } from "react";
import AggregationSelectors from "./AggregationSelectors";

export interface NomenclatureOption {
  name: string | null;
  id: string;
  configurations: {
    pieceInPack: number;
    packInPallet: number;
  }[];
}

interface AggregationFormProps {
  options: NomenclatureOption[] | null;
}

export default function AggregationForm({ options }: AggregationFormProps) {
  // Store the configuration selected in AggregationSelectors.
  const [selectedConfiguration, setSelectedConfiguration] = useState<{
    pieceInPack: number;
    packInPallet: number;
  } | null>(null);

  // Create an array to generate input fields based on the number of packs.
  const packInputs = selectedConfiguration
    ? Array.from({ length: selectedConfiguration.pieceInPack }, (_, i) => i)
    : [];

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <AggregationSelectors
        options={options}
        onConfigurationSelect={setSelectedConfiguration}
      />
      <div className="flex flex-row w-full gap-4 h-full">
        {/* Пачки Section */}
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Пачки</p>
              <button
                type="button"
                className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
              >
                Создать
              </button>
            </div>
            <div className="table-rows-layout">
              {packInputs.length > 0 ? (
                packInputs.map((_, index) => (
                  <div key={index} className="p-2 border my-1">
                    <label>Пачка {index + 1}</label>
                    <input
                      type="text"
                      placeholder={`Введите значение для пачки ${index + 1}`}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                ))
              ) : (
                <p>Выберите конфигурацию для отображения пачек</p>
              )}
            </div>
          </div>
        </div>
        {/* Паллеты Section */}
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Паллеты</p>
              <button
                type="button"
                className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
              >
                Загрузить
              </button>
            </div>
            <div className="table-rows-layout">
              <p>Здесь будут отображаться паллеты</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
