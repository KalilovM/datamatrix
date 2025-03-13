"use client";

import { useQuery } from "@tanstack/react-query";
import type { PrintTemplateData } from "../models/types";

export const printTemplateEdit = async (
	id: string,
): Promise<PrintTemplateData> => {
	const res = await fetch(`/api/printing-templates/${id}/edit`);
	if (!res.ok) {
		throw new Error("Ошибка загрузки данных");
	}
	const data = await res.json();
	return data;
};

export const usePrintTemplateEdit = (id: string) => {
	return useQuery<PrintTemplateData>({
		queryKey: ["printingTemplatesEdit", id],
		queryFn: async () => await printTemplateEdit(id),
	});
};
