"use client";

import { useQuery } from "@tanstack/react-query";

export function usePrintTemplate() {
	return useQuery({
		queryKey: ["aggregatedCodesPrintTemplate"],
		queryFn: async () => {
			const res = await fetch("/api/aggregated-codes/print");
			if (!res.ok) throw new Error("Ошибка загрузки шаблона печати");
			return res.json();
		},
	});
}
