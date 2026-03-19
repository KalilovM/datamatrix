"use client";

import type { NomenclatureEditData } from "@/nomenclature/model/schema";
import { useQuery } from "@tanstack/react-query";

type NomenclatureByIdResponse = Omit<NomenclatureEditData, "gtinSize"> & {
	gtinSize?: NomenclatureEditData["gtinSize"];
	sizeGtin?: NomenclatureEditData["gtinSize"];
};

function normalizeNomenclature(
	data: NomenclatureByIdResponse,
): NomenclatureEditData {
	return {
		...data,
		gtinSize: data.gtinSize ?? data.sizeGtin ?? [],
	};
}

export function useNomenclatureById(id: string) {
	return useQuery<NomenclatureEditData>({
		queryKey: ["nomenclature", id],
		queryFn: async () => {
			const res = await fetch(`/api/nomenclature/${id}`);
			if (!res.ok) throw new Error("Ошибка загрузки номенклатуры");
			const data: NomenclatureByIdResponse = await res.json();
			return normalizeNomenclature(data);
		},
		enabled: !!id,
	});
}
