"use client";

import { useQuery } from "@tanstack/react-query";
import {
	AGGREGATED_CODES_PAGE_SIZE,
	type AggregatedCodesResponse,
	type Filters,
} from "../definitions";

export function useAggregatedCodes(
	filters: Filters = {},
	page = 1,
	pageSize = AGGREGATED_CODES_PAGE_SIZE,
) {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (typeof value === "string" && value.length > 0) {
			params.set(key, value);
		}
	});
	params.set("page", String(page));
	params.set("pageSize", String(pageSize));

	return useQuery<AggregatedCodesResponse>({
		queryKey: ["aggregatedCodes", filters, page, pageSize],
		queryFn: async () => {
			const res = await fetch(`/api/aggregated-codes?${params.toString()}`);
			if (!res.ok) throw new Error("Ошибка загрузки агрегированных кодов");
			return res.json();
		},
	});
}
