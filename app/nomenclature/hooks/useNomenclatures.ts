"use client";

import { useQuery } from "@tanstack/react-query";
import {
	NOMENCLATURE_PAGE_SIZE,
	type NomenclaturesResponse,
} from "../model/types";

interface Filters {
	name?: string;
	modelArticle?: string;
	color?: string;
	gtin?: string;
}

export function useNomenclatures(
	filters: Filters = {},
	page = 1,
	pageSize = NOMENCLATURE_PAGE_SIZE,
) {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (typeof value === "string" && value.length > 0) {
			params.set(key, value);
		}
	});
	params.set("page", String(page));
	params.set("pageSize", String(pageSize));

	return useQuery<NomenclaturesResponse>({
		queryKey: ["nomenclatures", filters, page, pageSize],
		queryFn: async () => {
			const res = await fetch(`/api/nomenclature?${params.toString()}`);
			if (!res.ok) throw new Error("Ошибка загрузки номенклатур");
			return res.json();
		},
	});
}
