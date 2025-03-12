"use client";

import { useQuery } from "@tanstack/react-query";

export function useNomenclatureById(id: string) {
	return useQuery({
		queryKey: ["nomenclature", id],
		queryFn: async () => {
			const res = await fetch(`/api/nomenclature/${id}`);
			if (!res.ok) throw new Error("Ошибка загрузки номенклатуры");
			return res.json();
		},
		enabled: !!id,
	});
}
