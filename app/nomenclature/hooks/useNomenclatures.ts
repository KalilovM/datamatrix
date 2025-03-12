"use client";

import { useQuery } from "@tanstack/react-query";

export function useNomenclatures() {
	return useQuery({
		queryKey: ["nomenclatures"],
		queryFn: async () => {
			const res = await fetch("/api/nomenclature");
			if (!res.ok) throw new Error("Ошибка загрузки номенклатур");
			return res.json();
		},
	});
}
