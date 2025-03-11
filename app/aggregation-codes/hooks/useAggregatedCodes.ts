"use client";

import { useQuery } from "@tanstack/react-query";

export function useAggregatedCodes() {
	return useQuery({
		queryKey: ["aggregatedCodes"],
		queryFn: async () => {
			const res = await fetch("/api/aggregated-codes");
			if (!res.ok) throw new Error("Ошибка загрузки агрегированных кодов");
			return res.json();
		},
	});
}
