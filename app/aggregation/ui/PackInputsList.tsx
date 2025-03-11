"use client";

import { useAggregationPackStore } from "../store/aggregationPackStore";
import PackInput from "./PackInput";

export default function PackInputsList() {
	const { pages, currentPage } = useAggregationPackStore();

	if (!pages[currentPage]) return null;

	return (
		<div className="flex flex-col gap-4 w-full print:hidden">
			{pages[currentPage].packValues.map((value, index) => (
				<PackInput key={index} index={index} value={value} />
			))}
		</div>
	);
}
