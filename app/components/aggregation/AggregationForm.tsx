"use client";

import React, { useState, useCallback } from "react";
import AggregationSelectors from "../../app/aggregation/components/AggregationSelectors";
import PackInputsSection from "./PackInputsSection";
import { NomenclatureOption, Configuration } from "./definitions";

interface AggregationFormProps {
  options: NomenclatureOption[] | null;
}

const AggregationForm: React.FC<AggregationFormProps> = ({ options }) => {
  const [selectedConfiguration, setSelectedConfiguration] =
    useState<Configuration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handleConfigurationSelect = useCallback(
    (
      config: {
        pieceInPack: number;
        packInPallet: number;
        id: string;
        nomenclatureId: string;
      } | null,
    ) => {
      setSelectedConfiguration(config);
    },
    [],
  );

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <AggregationSelectors
        options={options}
        onConfigurationSelect={handleConfigurationSelect}
      />
      <div className="flex flex-row w-full gap-4 h-full">
        <div className="w-1/2">
          <PackInputsSection
            selectedConfiguration={selectedConfiguration}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Паллеты</p>
            </div>
            <div className="table-rows-layout">
              <p className="px-8 py-3">Здесь будут отображаться паллеты</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggregationForm;
