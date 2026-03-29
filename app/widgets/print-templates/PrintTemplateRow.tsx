"use client";

import { BinIcon, EditIcon } from "@/components/Icons";
import type { PrintTemplate } from "@/entities/print-template/model/types";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface PrintTemplateRowProps {
	template: PrintTemplate;
}

const PRINT_TEMPLATE_TYPES: Record<PrintTemplate["type"], string> = {
	AGGREGATION: "Агрегация",
	NOMENCLATURE: "Номенклатура",
};

const PRINT_TEMPLATE_LAYOUTS: Record<PrintTemplate["layout"], string> = {
	NOMENCLATURE_DETAILS: "Готовый шаблон",
	STANDARD: "Номенклатура",
};

const PrintTemplateRow: React.FC<PrintTemplateRowProps> = ({ template }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const invalidateTemplateQueries = () => {
		queryClient.invalidateQueries({ queryKey: ["printTemplates"] });
		queryClient.invalidateQueries({ queryKey: ["printTemplateNomenclature"] });
		queryClient.invalidateQueries({ queryKey: ["printTemplate"] });
		queryClient.invalidateQueries({ queryKey: ["aggregatedCodesPrintTemplate"] });
	};

	const makeDefaultMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch("/api/printing-templates/default", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				throw new Error((await response.json()).error);
			}
		},
		onSuccess: () => {
			invalidateTemplateQueries();
			toast.success("Шаблон успешно установлен по умолчанию");
		},
		onError: () => {
			toast.error("Ошибка при установке шаблона по умолчанию");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/printing-templates/${template.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = (await response.json().catch(() => null)) as
					| { error?: string }
					| null;
				throw new Error(data?.error || "Ошибка при удалении шаблона печати");
			}
		},
		onSuccess: () => {
			invalidateTemplateQueries();
			toast.success("Шаблон печати успешно удален");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Ошибка при удалении шаблона печати");
		},
		onSettled: () => {
			setModalOpen(false);
		},
	});

	const templatePurpose =
		template.type === "NOMENCLATURE"
			? PRINT_TEMPLATE_LAYOUTS[template.layout]
			: PRINT_TEMPLATE_TYPES[template.type];

	return (
		<>
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
				<td className="px-8 py-4 font-medium text-gray-900 whitespace-nowrap">
					{template.name}
				</td>
				<td className="px-8 py-4">
					{new Date(template.createdAt).toLocaleDateString("ru-RU")}
				</td>
				<td className="px-8 py-4">{templatePurpose}</td>
				<td className="px-8 py-4 text-center">
					<input
						id={`default-checkbox-${template.id}`}
						type="checkbox"
						checked={template.isDefault}
						onChange={() => {
							makeDefaultMutation.mutate(template.id);
						}}
						disabled={makeDefaultMutation.isPending || deleteMutation.isPending}
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
						disabled={deleteMutation.isPending}
						className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
					>
						<BinIcon className="size-5" />
					</button>
				</td>
			</tr>
			{modalOpen && (
				<ConfirmModal
					title="Удаление шаблона"
					message={`Вы уверены, что хотите удалить шаблон "${template.name}"?`}
					onConfirm={() => {
						deleteMutation.mutate();
					}}
					isOpen={modalOpen}
					onCancel={() => {
						if (!deleteMutation.isPending) {
							setModalOpen(false);
						}
					}}
				/>
			)}
		</>
	);
};

export default PrintTemplateRow;
