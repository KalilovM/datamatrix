"use client";

import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon } from "@/shared/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface Nomenclature {
	id: string;
	name: string;
	modelArticle: string;
	codeCount: number;
	color: string;
	GTIN: string;
}

interface Props {
	nomenclature: Nomenclature;
}

export default function NomenclatureRow({ nomenclature }: Props) {
	const queryClient = useQueryClient();
	const [isModalOpen, setModalOpen] = useState(false);

	// Mutation for deletion
	const deleteMutation = useMutation({
		mutationFn: () =>
			fetch(`/api/nomenclature/${nomenclature.id}`, {
				method: "DELETE",
			}).then(async (res) => {
				if (!res.ok) {
					throw new Error("Ошибка при удалении номенклатуры");
				}
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["nomenclatures"],
			});
			queryClient.invalidateQueries({
				queryKey: ["nomenclaturesOptions"],
			});
			toast.success("Номенклатура успешно удалена!");
		},
		onError: () => {
			toast.error("Ошибка при удалении номенклатуры");
		},
		onSettled: () => {
			setModalOpen(false);
		},
	});

	return (
		<>
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{nomenclature.name}
				</td>
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{nomenclature.GTIN}
				</td>
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{nomenclature.modelArticle}
				</td>
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{nomenclature.color}
				</td>
				<td className="px-6 py-4 text-gray-700 whitespace-nowrap">
					{nomenclature.codeCount}
				</td>
				<td className="px-6 py-4 flex items-center justify-end gap-2">
					<Link
						href={`/nomenclature/${nomenclature.id}/edit`}
						className="bg-blue-500 px-2.5 py-2.5 text-white rounded-md"
					>
						<EditIcon className="size-5" />
					</Link>
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						className="bg-red-500 px-2.5 py-2.5 text-white rounded-md"
					>
						<BinIcon className="size-5" />
					</button>
				</td>
			</tr>

			{/* Confirm Delete Modal */}
			<ConfirmModal
				isOpen={isModalOpen}
				onCancel={() => setModalOpen(false)}
				onConfirm={() => deleteMutation.mutate()}
				title="Удаление номенклатуры"
				message={`Номенклатура "${nomenclature.name}" будет удалена.`}
			/>
		</>
	);
}
