"use client";

import { useQuery } from "@tanstack/react-query";
import type { NomenclatureOption } from "../model/types";

export const fetchNomenclatureOptions = async (): Promise<
	NomenclatureOption[]
> => {
	const res = await fetch("/api/aggregations/nomenclature");
	if (!res.ok) {
		throw new Error("Ошибка загрузки данных");
	}
	const data = await res.json();
	return data;
};

export const useNomenclatureOptions = () => {
	return useQuery<NomenclatureOption[]>({
		queryKey: ["nomenclatureOptions"],
		queryFn: async () => await fetchNomenclatureOptions(),
	});
};
