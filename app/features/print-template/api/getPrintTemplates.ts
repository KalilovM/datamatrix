import type { PrintTemplate } from "@/entities/print-template/model/types";

export const getPrintTemplates = async (): Promise<PrintTemplate[]> => {
	const response = await fetch("/api/printing-templates", {
		cache: "no-store",
	});
	return response.json();
};
