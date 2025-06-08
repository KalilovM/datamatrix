"use client";

import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import TableContent from "@/components/aggregation-codes/TableContent";
import Layout from "@/shared/ui/Layout";
import { useAggregatedCodes } from "./hooks/useAggregatedCodes";
import { usePrintTemplate } from "./hooks/usePrintTemplate";
import { useAggregationCodesStore } from "./store/aggregationCodesStore";
import { useAggregationCodesFilterStore } from "./store/aggregationCodesFilterStore";

export default function Page() {
       const { filters, setFilters } = useAggregationCodesFilterStore();

       const {
               data: aggregatedCodes,
               isLoading: codesLoading,
               error: codesError,
       } = useAggregatedCodes(filters);

	const {
		data: defaultTemplate,
		isLoading: templateLoading,
		error: templateError,
	} = usePrintTemplate();

	const { nomenclature } = useAggregationCodesStore();

	if (codesLoading || templateLoading)
		return (
			<Layout>
				<p>Загрузка...</p>
			</Layout>
		);
	if (codesError || templateError)
		return (
			<Layout>
				<p>Ошибка загрузки данных</p>
			</Layout>
		);
	return (
		<Layout className="print:block print:h-auto print:w-auto printable">
			<>
                               <TableContent
                                       aggregatedCodes={aggregatedCodes}
                                       filters={filters}
                                       onApply={(newFilters) => setFilters(newFilters)}
                               />
				<PrintCodes
					printTemplate={defaultTemplate}
					selectedNomenclature={nomenclature}
				/>
			</>
		</Layout>
	);
}
