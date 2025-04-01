"use client";

import { useQuery } from "@tanstack/react-query";

interface Filters {
	name?: string;
	modelArticle?: string;
	color?: string;
	gtin?: string;
}

export function useNomenclatures(filters: Filters = {}) {
	const queryString = new URLSearchParams(filters).toString();

	return useQuery({
		queryKey: ["nomenclatures", filters],
		queryFn: async () => {
			const res = await fetch(`/api/nomenclature?${queryString}`);
			if (!res.ok) throw new Error("Ошибка загрузки номенклатур");
			return res.json();
		},
	});
}
