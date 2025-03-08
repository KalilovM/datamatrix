"use client";

import { useNomenclatureOptions } from "../api/aggregationApi";
import AggregationSelectors from "./AggregationSelectors";

export default function AggregationForm() {
	const { data: options, isLoading, error } = useNomenclatureOptions();

	if (isLoading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка загрузки данных</p>;

	return (
		<div className="flex flex-col w-full h-full gap-4">
			<AggregationSelectors options={options || []} />
			<div className="flex flex-row w-full gap-4 h-full">
				{/* Placeholder for additional sections */}
			</div>
		</div>
	);
}
