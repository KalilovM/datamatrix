import { useGtinSizeStore } from "@/nomenclature/stores/sizegtinStore";
import type { IGtinSize } from "@/nomenclature/stores/sizegtinStore";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon, PlusIcon } from "@/shared/ui/icons";
import { useState } from "react";
import SizeGtinUploadModal from "./SizeGtinUploadModal";

export function SizeGtinTable({
	onSaveGtinSize,
}: {
	onSaveGtinSize: (
		newGtinSize: IGtinSize,
		oldGtin?: string,
		oldSize?: number,
	) => void;
}) {
	const { gtinSize, removeGtinSize } = useGtinSizeStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteGtinSize, setDeleteGtinSize] = useState<IGtinSize | null>(null);
	const [editingGtinSize, setEditingGtinSize] = useState<IGtinSize | null>(
		null,
	);

	const handleSave = (size: IGtinSize, oldGtin?: string, oldSize?: number) => {
		setEditingGtinSize(null);
		setIsModalOpen(false);
		onSaveGtinSize(size, oldGtin, oldSize);
	};

	const handleEdit = (row: IGtinSize) => {
		setEditingGtinSize(row);
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setEditingGtinSize(null);
		setIsModalOpen(false);
	};

	const handleConfirmDelete = (row: IGtinSize) => {
		setEditingGtinSize(null);
		setIsModalOpen(false);
		removeGtinSize(row.GTIN);
	};

	const handleDelete = (row: IGtinSize) => {
		setDeleteGtinSize(row);
		setIsDeleteModalOpen(true);
	};

	return (
		<div className="w-1/2">
			<div className="table-layout">
				{/* Table Header */}
				<div className="table-header flex justify-between items-center">
					<p className="table-header-title">Размеры</p>
					<button
						type="button"
						onClick={() => {
							setIsModalOpen(true);
						}}
						className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer flex flex-row gap-1 items-center"
					>
						<span>Создать</span>
						<PlusIcon className="size-5" />
					</button>
				</div>

				{/* Table Rows */}
				<div className="table-rows-layout relative max-h-[325px] border border-gray-200 rounded-b-md">
					<table className="w-full text-sm text-left text-gray-500 table-fixed">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0">
							<tr>
								<th scope="col" className="px-6 py-3">
									Размер
								</th>
								<th scope="col" className="px-6 py-3">
									GTIN
								</th>
								<th scope="col" className="px-6 py-3 text-right">
									Действия
								</th>
							</tr>
						</thead>
						<tbody>
							{gtinSize.length > 0 ? (
								gtinSize.map((row) => (
									<tr
										key={row.size}
										className="bg-white border-b border-gray-200 hover:bg-gray-50"
									>
										<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
											{row.size}
										</td>
										<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
											{row.GTIN}
										</td>
										<td className="px-6 py-4 text-right flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() => handleEdit(row)}
												className="bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<EditIcon className="size-5" />
											</button>
											<button
												type="button"
												onClick={() => handleDelete(row)}
												className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<BinIcon className="size-5" />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={3} className="text-center py-4 text-gray-500">
										Нет Размеров
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isModalOpen && (
				<SizeGtinUploadModal
					gtinSize={editingGtinSize}
					onClose={handleClose}
					onSave={handleSave}
				/>
			)}
			{isDeleteModalOpen && (
				<ConfirmModal
					isOpen={isDeleteModalOpen}
					onCancel={() => setIsDeleteModalOpen(false)}
					onConfirm={() => {
						if (deleteGtinSize) {
							handleConfirmDelete({
								GTIN: deleteGtinSize.GTIN,
								size: deleteGtinSize.size,
							} as IGtinSize);
						}
						setIsDeleteModalOpen(false);
					}}
					title="Удалить размер"
					message={`Вы уверены, что хотите удалить размер ${deleteGtinSize.size} с GTIN ${deleteGtinSize.GTIN}?`}
				/>
			)}
		</div>
	);
}
