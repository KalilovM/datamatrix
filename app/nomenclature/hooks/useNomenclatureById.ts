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
	const normalizedGtinSize = data.gtinSize ?? data.sizeGtin ?? [];

	return {
		id: data.id,
		name: data.name,
		modelArticle: data.modelArticle,
		color: data.color,
		composition: data.composition,
		configurations: data.configurations,
		codes: data.codes,
		gtinSize: normalizedGtinSize,
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
