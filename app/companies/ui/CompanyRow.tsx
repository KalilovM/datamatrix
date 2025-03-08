"use client";

import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon } from "@/shared/ui/icons";
import type { Company } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface CompanyRowProps {
	company: Company;
}

export default function CompanyRow({ company }: CompanyRowProps) {
	const router = useRouter();
	const [isModalOpen, setModalOpen] = useState(false);

	const confirmDelete = async () => {
		try {
			const res = await fetch(`/api/companies/${company.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Ошибка удаления компании");

			toast.success("Компания удалена");
			router.refresh();
		} catch (err: unknown) {
			toast.error((err as Error).message);
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<>
			{/* Table Row (Without Modal) */}
			<tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
				<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
					{company.name}
				</td>
				<td className="px-6 py-4 text-gray-600">
					{new Date(company.subscriptionEnd).toLocaleDateString("ru-RU")}
				</td>
				<td className="px-6 py-4 text-right flex items-center justify-end">
					<Link
						href={`/companies/${company.id}/edit`}
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

			{/* Delete Confirmation Modal (Outside the Table) */}
			<ConfirmModal
				isOpen={isModalOpen}
				title="Удалить компанию?"
				message={`Вы уверены, что хотите удалить "${company.name}"?`}
				onConfirm={confirmDelete}
				onCancel={() => setModalOpen(false)}
			/>
		</>
	);
}
