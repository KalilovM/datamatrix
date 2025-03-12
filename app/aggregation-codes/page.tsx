"use client";

import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import TableContent from "@/components/aggregation-codes/TableContent";
import Layout from "@/shared/ui/Layout";
import { useAggregatedCodes } from "./hooks/useAggregatedCodes";
import { usePrintTemplate } from "./hooks/usePrintTemplate";
import { useAggregationCodesStore } from "./store/aggregationCodesStore";

export default function Page() {
	const {
		data: aggregatedCodes,
		isLoading: codesLoading,
		error: codesError,
	} = useAggregatedCodes();

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
				<TableContent aggregatedCodes={aggregatedCodes} />
				<PrintCodes
					printTemplate={defaultTemplate}
					selectedNomenclature={nomenclature}
				/>
			</>
		</Layout>
	);
}
