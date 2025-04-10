"use client";

import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon, EyeIcon } from "@/shared/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface Nomenclature {
	id: string;
	name: string;
	modelArticle: string;
	codeCount: number;
	color: string;
	GTIN: string[];
}

interface Props {
	nomenclature: Nomenclature;
}

export default function NomenclatureRow({ nomenclature }: Props) {
	const queryClient = useQueryClient();
	const [isModalOpen, setModalOpen] = useState(false);

	const [isGtinExpanded, setGtinExpanded] = useState(false);
	const gtinWrapperRef = useRef<HTMLTableCellElement | null>(null);

	const toggleGtin = () => setGtinExpanded((prev) => !prev);

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
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50 w-full">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{nomenclature.name}
				</td>
				<td
					className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap relative"
					ref={gtinWrapperRef}
				>
					<div className="flex items-center gap-2 flex-wrap">
						<button
							type="button"
							className="text-black text-sm underline p-2 border border-neutral-300 rounded-md"
							onClick={toggleGtin}
						>
							<EyeIcon className="size-6" stroke="#000" strokeWidth="1" />
						</button>
					</div>

					{/* Dropdown for rest GTINs */}
					{isGtinExpanded && (
						<div className="absolute left-0 mt-1 bg-white shadow-lg border rounded-md p-2 z-50 min-w-[150px]">
							{nomenclature.GTIN.map((gtin, idx) => (
								<div
									key={idx}
									className="text-sm text-gray-700 px-2 py-1 hover:bg-gray-100 rounded"
								>
									{gtin}
								</div>
							))}
							<button
								type="button"
								className="text-xs text-gray-500 mt-2 underline"
								onClick={() => setGtinExpanded(false)}
							>
								Скрыть
							</button>
						</div>
					)}
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
