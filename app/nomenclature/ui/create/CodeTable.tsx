import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, UploadIcon } from "@/shared/ui/icons";
import { EyeIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { CodeViewModal } from "../edit/CodeViewModal";
import CodesUploadModal from "./CodesUploadModal";

export interface Code {
	fileName: string;
	content: string;
	size: number;
	GTIN: string;
}

interface ParsedCode {
	fileName: string;
	codes: string[];
	size: number;
	GTIN: string;
}

interface CodeTableProps {
	value?: Code[]; // the controlled array of code files
	onChange: (value: Code[]) => void; // callback to update codes
}

export default function CodeTable({ value = [], onChange }: CodeTableProps) {
	const codes = value;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteFileName, setDeleteFileName] = useState<string | null>(null);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [codesList, setCodesList] = useState<ParsedCode[]>([]);
	const [codesView, setCodesView] = useState<string[]>([]);

	const handleConfirmDelete = (fileName: string) => {
		const updated = codes.filter((code) => code.fileName !== fileName);
		onChange(updated);
		setCodesList((prev) => prev.filter((file) => file.fileName !== fileName));
		toast.success("Файл удален");
	};

	const handleDelete = (fileName: string) => {
		setIsDeleteModalOpen(true);
		setDeleteFileName(fileName);
	};

	const handleUpload = (newCodes: Code[]) => {
		onChange([...codes, ...newCodes]);

		const parsed = newCodes.map((newCode) => {
			const lines = newCode.content
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter((line) => line.length > 0);
			return {
				fileName: newCode.fileName,
				codes: lines,
				size: newCode.size,
				GTIN: newCode.GTIN,
			};
		});
		setCodesList((prev) => [...prev, ...parsed]);
		setIsModalOpen(false);
	};

	const handleView = (fileName: string) => {
		const file = codesList.find((c) => c.fileName === fileName);
		if (file) {
			setCodesView(file.codes);
			setIsViewModalOpen(true);
		} else {
			toast.error("Коды не найдены для выбранного файла");
		}
	};

	return (
		<div className="w-full min-h-[400px] max-h-[550px]">
			<div className="table-layout">
				{/* Table Header */}
				<div className="table-header flex justify-between items-center">
					<p className="table-header-title">Коды DataMatrix</p>
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer flex flex-row gap-1 items-center"
					>
						<span>Загрузить</span>
						<UploadIcon className="size-5" />
					</button>
				</div>

				{/* Table Rows */}
				<div className="table-rows-layout relative overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
							<tr>
								<th
									scope="col"
									className="pl-6 pr-2 py-3 whitespace-nowrap w-0"
								>
									Размер
								</th>
								<th
									scope="col"
									className="pl-6 pr-2 py-3 whitespace-nowrap w-0"
								>
									GTIN
								</th>
								<th scope="col" className="px-6 py-3 text-start">
									Имя файла
								</th>
								<th scope="col" className="px-6 py-3 text-right">
									Действия
								</th>
							</tr>
						</thead>
						<tbody>
							{codes.length > 0 ? (
								codes.map((file) => (
									<tr
										key={file.fileName}
										className="bg-white border-b border-gray-200 hover:bg-gray-50"
									>
										<td className="pl-6 pr-2 py-4 font-medium whitespace-nowrap w-0">
											{file.size}
										</td>
										<td className="pl-6 pr-2 py-4 font-medium whitespace-nowrap w-0">
											{file.GTIN}
										</td>
										<td className="px-6 py-4 font-medium justify-start items-center text-gray-900 whitespace-nowrap truncate max-w-[150]">
											{file.fileName}
										</td>
										<td className="px-6 py-4 text-right flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() => handleView(file.fileName)}
												className="bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<EyeIcon className="size-5" />
											</button>

											<button
												type="button"
												onClick={() => handleDelete(file.fileName)}
												className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<BinIcon className="size-5" />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="text-center py-4 text-gray-500">
										Нет кодов
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isModalOpen && (
				<CodesUploadModal
					codes={codesList}
					onClose={() => setIsModalOpen(false)}
					onAdd={handleUpload}
				/>
			)}

			{isDeleteModalOpen && (
				<ConfirmModal
					isOpen={isDeleteModalOpen}
					onCancel={() => setIsDeleteModalOpen(false)}
					onConfirm={() => {
						if (deleteFileName) {
							handleConfirmDelete(deleteFileName);
						}
						setIsDeleteModalOpen(false);
					}}
					title="Удалить файл?"
					message={`Вы уверены, что хотите удалить файл ${deleteFileName}?`}
				/>
			)}
			<CodeViewModal
				codes={codesView}
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
			/>
		</div>
	);
}
