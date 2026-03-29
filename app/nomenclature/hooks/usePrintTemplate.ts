"use client";

import { useQuery } from "@tanstack/react-query";

export function usePrintTemplate() {
	return useQuery({
		queryKey: ["printTemplateNomenclature"],
		queryFn: async () => {
			const res = await fetch("/api/nomenclature/print", {
				cache: "no-store",
			});
			if (!res.ok) {
				throw new Error("Ошибка загрузки шаблона печати");
			}
			return res.json();
		},
		refetchOnMount: "always",
	});
}
