"use client";

import type { NomenclatureOption } from "@/aggregation/model/types";
import AggregationSelectors from "@/aggregation/ui/AggregationSelectors";
import PackInputsSection from "@/aggregation/ui/PackInputsSection";

interface AggregationFormProps {
  options: NomenclatureOption[];
}

const AggregationForm: React.FC<AggregationFormProps> = ({ options }) => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <AggregationSelectors options={options} />
      <div className="flex flex-row w-full gap-4 h-full">
        <div className="w-1/2">
          <PackInputsSection />
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
