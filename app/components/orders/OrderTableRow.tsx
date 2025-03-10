"use client";

import type { IOrder } from "@/orders/defenitions";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { BinIcon, EditIcon } from "../Icons";

export default function OrderTableRow({ order }: { order: IOrder }) {
	const router = useRouter();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		router.push(`orders/${order.id}/edit`);
	};

	const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		try {
			const res = await fetch(`/api/orders/${order.id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const error = await res.json();
				toast.error(error.message || "Ошибка при удалении заказа");
			} else {
				toast.success("Заказ успешно удален");
				router.refresh(); // refresh the list
			}
		} catch (err) {
			toast.error("Ошибка при удалении заказа");
		} finally {
			setModalOpen(false);
		}
	};

	const handleCancelDelete = () => {
		setModalOpen(false);
	};

	return (
		<>
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{order.id}
				</td>
				<td className="px-6 py-4 text-gray-600">{order.counteragent.name}</td>
				<td className="px-6 py-4 text-right flex items-center justify-end">
					<button
						onClick={handleEdit}
						className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md"
					>
						<EditIcon className="size-5" />
					</button>
					<button
						onClick={handleDeleteClick}
						className="bg-red-500 px-2.5 py-2.5 text-white rounded-md"
					>
						<BinIcon className="size-5" />
					</button>
				</td>
			</tr>

			{isModalOpen && (
				<ConfirmModal
					isOpen={isModalOpen}
					title="Удалить заказ?"
					message={`Вы уверены, что хотите удалить "${order.id}"?`}
					onConfirm={handleConfirmDelete}
					onCancel={() => setModalOpen(false)}
				/>
			)}
		</>
	);
}
