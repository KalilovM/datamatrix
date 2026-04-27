"use client";

import { useEffect, useState } from "react";
import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import TableContent from "@/components/aggregation-codes/TableContent";
import Layout from "@/shared/ui/Layout";
import { AGGREGATED_CODES_PAGE_SIZE } from "./definitions";
import { useAggregatedCodes } from "./hooks/useAggregatedCodes";
import { usePrintTemplate } from "./hooks/usePrintTemplate";
import { useAggregationCodesStore } from "./store/aggregationCodesStore";
import { useAggregationCodesFilterStore } from "./store/aggregationCodesFilterStore";

export default function Page() {
	const [currentPage, setCurrentPage] = useState(1);
	const { filters, setFilters } = useAggregationCodesFilterStore();

	const {
		data: aggregatedCodes,
		isLoading: codesLoading,
		error: codesError,
	} = useAggregatedCodes(filters, currentPage, AGGREGATED_CODES_PAGE_SIZE);

	const {
		data: defaultTemplate,
		isLoading: templateLoading,
		error: templateError,
	} = usePrintTemplate();

	const { nomenclature } = useAggregationCodesStore();

	useEffect(() => {
		if (aggregatedCodes && aggregatedCodes.page !== currentPage) {
			setCurrentPage(aggregatedCodes.page);
		}
	}, [aggregatedCodes, currentPage]);

	if ((codesLoading && !aggregatedCodes) || templateLoading)
		return (
			<Layout>
				<p>Загрузка...</p>
			</Layout>
		);

	if (codesError || templateError || !aggregatedCodes)
		return (
			<Layout>
				<p>Ошибка загрузки данных</p>
			</Layout>
		);

	return (
		<Layout className="print:block print:h-auto print:w-auto printable">
			<>
				<div className="print:hidden">
					<TableContent
						aggregatedCodes={aggregatedCodes.items}
						currentPage={aggregatedCodes.page}
						pageSize={aggregatedCodes.pageSize}
						totalCount={aggregatedCodes.totalCount}
						totalPages={aggregatedCodes.totalPages}
						filters={filters}
						onApply={(newFilters) => {
							setCurrentPage(1);
							setFilters(newFilters);
						}}
						onPageChange={setCurrentPage}
					/>
				</div>
				<PrintCodes
					printTemplate={defaultTemplate}
					selectedNomenclature={nomenclature}
				/>
			</>
		</Layout>
	);
}
