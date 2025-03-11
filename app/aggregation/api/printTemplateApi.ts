"use client";

import { useQuery } from "@tanstack/react-query";
import type { PrintTemplate } from "../model/types";

export const fetchPrintTemplate = async (): Promise<PrintTemplate> => {
	const res = await fetch("/api/aggregations/print");
	if (!res.ok) {
		throw new Error("Ошибка загрузки данных");
	}
	const data = await res.json();
	return data;
};

export const usePrintTemplate = () => {
	return useQuery<PrintTemplate>({
		queryKey: ["printTemplate"],
		queryFn: async () => await fetchPrintTemplate(),
	});
};
