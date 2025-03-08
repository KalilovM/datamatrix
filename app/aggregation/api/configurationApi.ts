"use client";

import { useQuery } from "@tanstack/react-query";
import type { AggregationConfig } from "../model/types";

const fetchConfigurations = async (
	nomenclatureId: string,
): Promise<AggregationConfig[]> => {
	const res = await fetch(`/api/nomenclature/${nomenclatureId}/configurations`);

	if (!res.ok) {
		throw new Error("Ошибка загрузки конфигурации");
	}

	const data = await res.json();
	return data;
};

export const useConfigurations = (nomenclatureId: string) => {
	return useQuery<AggregationConfig[]>({
		queryKey: ["configurations", nomenclatureId],
		queryFn: () => fetchConfigurations(nomenclatureId),
		enabled: !!nomenclatureId,
	});
};
