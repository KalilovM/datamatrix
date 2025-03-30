"use client";

import type { Counteragent } from "@/entities/counteragent/types";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon } from "@/shared/ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface CounteragentRowProps {
	counteragent: Counteragent;
}

export default function CounteragentRow({
	counteragent,
}: CounteragentRowProps) {
	const queryClient = useQueryClient();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/counteragents/${counteragent.id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Не удалось удалить контрагента");
			}
			toast.success("Контрагент успешно удален");
			queryClient.invalidateQueries({
				queryKey: ["counteragents"],
			});
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<>
			<tr className="bg-white border-b hover:bg-gray-50">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{counteragent.name}
				</td>
				<td className="px-6 py-4 text-gray-600">
					{counteragent.inn || "Пусто"}
				</td>
				<td className="px-6 py-4 text-gray-600">
					{counteragent.kpp || "Пусто"}
				</td>
				<td className="px-6 py-4 text-right flex items-center justify-end">
					<Link
						href={`/counteragents/${counteragent.id}/edit`}
						className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md"
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
			{isModalOpen && (
				<ConfirmModal
					isOpen={isModalOpen}
					title="Удалить контрагента?"
					message={`Вы уверены, что хотите удалить "${counteragent.name}"?`}
					onConfirm={handleDelete}
					onCancel={() => setModalOpen(false)}
				/>
			)}
		</>
	);
}
