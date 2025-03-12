"use client";

import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { useNomenclatureOptions } from "../api/aggregationApi";
import { usePrintTemplate } from "../api/printTemplateApi";
import { useAggregationSelectionStore } from "../store/aggregationSelectionStore";
import AggregationSelectors from "./AggregationSelectors";
import PackInputsSection from "./PackInputsSection";

export default function AggregationForm() {
	const { data: options, isLoading, error } = useNomenclatureOptions();
	const { data: printTemplate } = usePrintTemplate();

	const { selectedNomenclature } = useAggregationSelectionStore();

	if (isLoading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка загрузки данных</p>;

	return (
		<div className="flex flex-col w-full h-full gap-4 print:gap-0">
			<AggregationSelectors options={options || []} />
			<div className="flex flex-row w-full gap-4 h-full print:hidden">
				<PackInputsSection />
			</div>
			<PrintCodes
				printTemplate={printTemplate}
				selectedNomenclature={selectedNomenclature}
			/>
		</div>
	);
}
