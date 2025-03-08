"use client";

import AggregationSelectors from "./AggregationSelectors";
import PackInputsSection from "./PackInputsSection";
import PalletsTable from "./PalletsTable";
import { useAggregationStore } from "../store";
import { NomenclatureOption } from "../types";

interface AggregationFormProps {
  options: NomenclatureOption[] | null;
}

const AggregationForm: React.FC<AggregationFormProps> = ({ options }) => {
  const { selectedConfiguration, setSelectedConfiguration } =
    useAggregationStore();

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <AggregationSelectors
        options={options}
        onConfigurationSelect={setSelectedConfiguration}
      />
      <div className="flex flex-row w-full gap-4 h-full">
        <PackInputsSection />
        <PalletsTable />
      </div>
    </div>
  );
};

export default AggregationForm;
