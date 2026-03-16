"use client";

import { useQuery } from "@tanstack/react-query";

interface Filters {
	name?: string;
	modelArticle?: string;
	color?: string;
	gtin?: string;
}

export function useNomenclatures(filters: Filters = {}) {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (typeof value === "string" && value.length > 0) {
			params.set(key, value);
		}
	});
	const queryString = params.toString();

	return useQuery({
		queryKey: ["nomenclatures", filters],
		queryFn: async () => {
			const res = await fetch(`/api/nomenclature?${queryString}`);
			if (!res.ok) throw new Error("Ошибка загрузки номенклатур");
			return res.json();
		},
	});
}
