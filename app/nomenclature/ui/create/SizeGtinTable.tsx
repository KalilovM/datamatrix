import { useGtinSizeStore } from "@/nomenclature/stores/sizegtinStore";
import type { IGtinSize } from "@/nomenclature/stores/sizegtinStore";
import { BinIcon, EditIcon, PlusIcon } from "@/shared/ui/icons";
import { useState } from "react";
import SizeGtinUploadModal from "./SizeGtinUploadModal";

export function SizeGtinTable() {
	const { gtinSize, addGtinSize } = useGtinSizeStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingGtinSize, setEditingGtinSize] = useState<IGtinSize | null>(
		null,
	);

	const handleSave = (size: IGtinSize) => {
		setEditingGtinSize(null);
		setIsModalOpen(false);
		addGtinSize(size);
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
				<div className="table-rows-layout relative overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
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
												onClick={() => console.log("Edit", row.size)}
												className="bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<EditIcon className="size-5" />
											</button>
											<button
												type="button"
												onClick={() => console.log("Delete", row.size)}
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
					onClose={() => setIsModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</div>
	);
}
