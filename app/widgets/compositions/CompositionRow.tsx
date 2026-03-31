"use client";

import type { Composition } from "@/entities/composition/types";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon } from "@/shared/ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface CompositionRowProps {
	composition: Composition;
}

function formatDate(value: string) {
	return new Date(value).toLocaleString("ru-RU");
}

export default function CompositionRow({ composition }: CompositionRowProps) {
	const queryClient = useQueryClient();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/compositions/${composition.id}`, {
				method: "DELETE",
			});
			const data = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(data?.error || "Не удалось удалить состав");
			}

			toast.success("Состав успешно удален");
			queryClient.invalidateQueries({
				queryKey: ["compositions"],
			});
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Неизвестная ошибка";
			toast.error(message);
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<>
			<tr className="border-b bg-white hover:bg-gray-50">
				<td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
					{composition.name}
				</td>
				<td className="px-6 py-4 text-gray-600">
					{formatDate(composition.createdAt)}
				</td>
				<td className="px-6 py-4 text-gray-600">
					{formatDate(composition.updatedAt)}
				</td>
				<td className="flex items-center justify-end px-6 py-4 text-right">
					<Link
						href={`/compositions/${composition.id}/edit`}
						className="mr-4 rounded-md bg-blue-500 px-2.5 py-2.5 text-white"
					>
						<EditIcon className="size-5" />
					</Link>
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						className="rounded-md bg-red-500 px-2.5 py-2.5 text-white"
					>
						<BinIcon className="size-5" />
					</button>
				</td>
			</tr>
			{isModalOpen && (
				<ConfirmModal
					isOpen={isModalOpen}
					title="Удалить состав?"
					message={`Вы уверены, что хотите удалить "${composition.name}"?`}
					onConfirm={handleDelete}
					onCancel={() => setModalOpen(false)}
				/>
			)}
		</>
	);
}
