"use client";

import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon } from "@/shared/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Nomenclature } from "../model/types";

interface Props {
	nomenclature: Nomenclature;
}

export default function NomenclatureRow({ nomenclature }: Props) {
	const router = useRouter();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleDelete = () => setModalOpen(true);

	const confirmDelete = async () => {
		try {
			const res = await fetch(`/api/nomenclature/${nomenclature.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Ошибка удаления номенклатуры");

			toast.success("Номенклатура удалена");
			router.refresh();
		} catch (err) {
			toast.error("Ошибка при удалении номенклатуры");
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<>
			{/* Table Row */}
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{nomenclature.name}
				</td>
				<td className="px-6 py-4 text-gray-600">{nomenclature.codeCount}</td>
				<td className="px-6 py-4 text-right flex items-center justify-end">
					<Link
						href={`/nomenclature/${nomenclature.id}/edit`}
						className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
					>
						<EditIcon className="size-5" />
					</Link>
					<button
						type="button"
						onClick={handleDelete}
						className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
					>
						<BinIcon className="size-5" />
					</button>
				</td>
			</tr>

			{/* Reusable Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={isModalOpen}
				onCancel={() => setModalOpen(false)}
				onConfirm={confirmDelete}
				title="Удалить номенклатуру?"
				message={`Вы уверены, что хотите удалить "${nomenclature.name}"?`}
			/>
		</>
	);
}
