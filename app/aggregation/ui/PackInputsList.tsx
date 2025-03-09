"use client";

import { useAggregationStore } from "../store/aggregationStore";
import PackInput from "./PackInput";

export default function PackInputsList() {
	const { pages, currentPage } = useAggregationStore();

	if (!pages[currentPage]) return null;

	return (
		<div className="flex flex-col gap-4 w-full print:hidden">
			{pages[currentPage].packValues.map((value, index) => (
				<PackInput key={index} index={index} value={value} />
			))}
		</div>
	);
}
