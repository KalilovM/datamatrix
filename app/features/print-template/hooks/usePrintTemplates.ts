import type { PrintTemplate } from "@/entities/print-template/model/types";
import { useQuery } from "@tanstack/react-query";
import { getPrintTemplates } from "../api/getPrintTemplates";

export const usePrintTemplates = () => {
	return useQuery<PrintTemplate[]>({
		queryKey: ["printTemplates"],
		queryFn: getPrintTemplates,
	});
};
