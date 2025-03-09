"use client";

import type { PrintTemplate } from "@/entities/print-template/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface PrintTemplateRowProps {
	template: PrintTemplate;
}

const PRINT_TEMPLATE_TYPES = {
	AGGREGATION: "Агрегация",
	NOMENCLATURE: "Номенклатура",
};

const PrintTemplateRow: React.FC<PrintTemplateRowProps> = ({ template }) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch("api/printing-templates/default", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: id, templateType: template.type }),
			});
			if (!response.ok) {
				throw new Error((await response.json()).error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["printTemplates"],
			});
			toast.success("Шаблон успешно установлен по умолчанию");
		},
		onError: () => {
			toast.error("Ошибка при установке шаблона по умолчанию");
		},
	});

	const handleMakeDefault = () => {
		mutation.mutate(template.id);
	};

	return (
		<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
			<td className="px-8 py-4 font-medium text-gray-900 whitespace-nowrap">
				{template.name}
			</td>
			<td className="px-8 py-4">
				{new Date(template.createdAt).toLocaleDateString("ru-RU")}
			</td>
			<td className="px-8 py-4">{PRINT_TEMPLATE_TYPES[template.type]}</td>
			<td className="px-8 py-4 text-right">
				{template.isDefault ? (
					<span className="text-green-600 font-bold">По умолчанию</span>
				) : (
					<button
						type="button"
						onClick={handleMakeDefault}
						className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
						disabled={mutation.isLoading}
					>
						{mutation.isLoading ? "Установка..." : "Сделать по умолчанию"}
					</button>
				)}
			</td>
		</tr>
	);
};

export default PrintTemplateRow;
