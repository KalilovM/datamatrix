"use client";

import { useAggregationPackStore } from "../store/aggregationPackStore";
import { useAggregationSelectionStore } from "../store/aggregationSelectionStore";
import PackInput from "./PackInput";

export default function PackInputsList() {
	const { pages, currentPage } = useAggregationPackStore();
	const { selectedNomenclature, selectedConfiguration } =
		useAggregationSelectionStore();

	if (!pages[currentPage]) return null;
	if (!selectedNomenclature || !selectedConfiguration) return null;

	return (
		<div className="flex flex-col gap-4 w-full print:hidden">
			{pages[currentPage].packValues.map((value, index) => (
				<PackInput key={index} index={index} value={value} />
			))}
		</div>
	);
}
