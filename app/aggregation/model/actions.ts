import type { NomenclatureOption } from "../model/types";

export const fetchNomenclatureOptions = async (): Promise<
	NomenclatureOption[]
> => {
	const res = await fetch("/api/nomenclature");
	if (!res.ok) {
		throw new Error("Ошибка загрузки данных");
	}
	const data = await res.json();
	return data;
};
