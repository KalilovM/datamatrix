"use client";

import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon } from "@/shared/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import type { User } from "../model/schema";

interface UserRowProps {
	user: User;
}

export default function UserRow({ user }: UserRowProps) {
	const router = useRouter();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleDelete = () => setModalOpen(true);

	const confirmDelete = async () => {
		try {
			const res = await fetch(`/api/users/${user.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Ошибка удаления пользователя");

			toast.success("Пользователь удален");
			router.refresh();
		} catch (err) {
			toast.error("Ошибка при удалении пользователя");
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<>
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{user.username}
				</td>
				<td className="px-6 py-4 text-gray-600">{user.role}</td>
				<td className="px-6 py-4 text-right flex items-center justify-end">
					<Link
						href={`/users/${user.id}/edit`}
						className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
					>
						<EditIcon className="size-5" />
					</Link>
					<button
						onClick={handleDelete}
						type="button"
						className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
					>
						<BinIcon className="size-5" />
					</button>
				</td>
			</tr>

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={isModalOpen}
				title="Удалить пользователя?"
				message={`Вы уверены, что хотите удалить "${user.username}"?`}
				onConfirm={confirmDelete}
				onCancel={() => setModalOpen(false)}
			/>
		</>
	);
}
