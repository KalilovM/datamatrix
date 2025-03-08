"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNomenclatureOptions } from "../model/actions";
import type { NomenclatureOption } from "../model/types";

export const useNomenclatureOptions = () => {
	return useQuery<NomenclatureOption[]>({
		queryKey: ["nomenclatureOptions"],
		queryFn: async () => await fetchNomenclatureOptions(),
	});
};
