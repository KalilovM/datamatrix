"use client";

import { BinIcon, EditIcon } from "@/components/Icons";
import type { PrintTemplate } from "@/entities/print-template/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface PrintTemplateRowProps {
	template: PrintTemplate;
}

const PRINT_TEMPLATE_TYPES = {
	AGGREGATION: "Агрегация",
	NOMENCLATURE: "Номенклатура",
};

const PrintTemplateRow: React.FC<PrintTemplateRowProps> = ({ template }) => {
	const [modalOpen, setModalOpen] = useState(false);
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
			queryClient.invalidateQueries({ queryKey: ["printTemplates"] });
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
			<td className="px-8 py-4 text-center">
				<input
					id={`default-checkbox-${template.id}`}
					type="checkbox"
					checked={template.isDefault}
					onChange={(e) => {
						// Trigger mutation only if the checkbox is being checked and it is not already default
						if (e.target.checked && !template.isDefault) {
							handleMakeDefault();
						}
					}}
					disabled={mutation.isLoading}
					className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
				/>
			</td>
			<td className="px-6 py-4 text-right flex items-center justify-end">
				<Link
					href={`/print-templates/${template.id}/edit`}
					className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
				>
					<EditIcon className="size-5" />
				</Link>
				<button
					type="button"
					onClick={() => setModalOpen(true)}
					className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
				>
					<BinIcon className="size-5" />
				</button>
			</td>
		</tr>
	);
};

export default PrintTemplateRow;
