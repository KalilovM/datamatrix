"use client";

import { useNomenclatureStore } from "@/nomenclature/model/store";
import { usePrintStore } from "@/shared/store/printStore";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EyeIcon, PrintIcon, UploadIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { CodeViewModal } from "./CodeViewModal";
import CodesUploadModal from "./CodesUploadModal";

export interface Code {
	fileName: string;
	content: string;
	id?: string;
	codes?: string[];
	size: string | number;
	GTIN: string;
	createdAt?: string;
}

interface CodeTableProps {
	value?: Code[];
	onChange: (value: Code[]) => void;
}

function getCodeIdentity(code: Code) {
	return (
		code.id ??
		`${code.fileName}::${code.createdAt ?? ""}::${String(code.size)}::${code.GTIN}`
	);
}

function getCodeTimestamp(createdAt?: string) {
	if (!createdAt) return Number.NEGATIVE_INFINITY;

	const timestamp = new Date(createdAt).getTime();
	return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function getCodeSize(size: Code["size"]) {
	const numericSize =
		typeof size === "number" ? size : Number.parseFloat(String(size));

	return Number.isNaN(numericSize) ? Number.NEGATIVE_INFINITY : numericSize;
}

function compareCodes(left: Code, right: Code) {
	const timestampDiff =
		getCodeTimestamp(right.createdAt) - getCodeTimestamp(left.createdAt);

	if (timestampDiff !== 0) {
		return timestampDiff;
	}

	const sizeDiff = getCodeSize(right.size) - getCodeSize(left.size);

	if (sizeDiff !== 0) {
		return sizeDiff;
	}

	return left.fileName.localeCompare(right.fileName, "ru");
}

export default function CodeTable({ value = [], onChange }: CodeTableProps) {
	const codes = value;
	const sortedCodes = [...codes].sort(compareCodes);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteCode, setDeleteCode] = useState<Code | null>(null);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [codesView, setCodesView] = useState<string[]>([]);
	const { setPrintCodes, setSize, triggerPrint } = usePrintStore();
	const { printTemplate } = useNomenclatureStore();

	const handleConfirmDelete = (codeToDelete: Code) => {
		const targetIdentity = getCodeIdentity(codeToDelete);
		const updated = codes.filter(
			(code) => getCodeIdentity(code) !== targetIdentity,
		);
		onChange(updated);
		toast.success("Файл удален");
	};

	const handleDelete = (code: Code) => {
		setIsDeleteModalOpen(true);
		setDeleteCode(code);
	};

	const handlePrint = (code: Code) => {
		setPrintCodes(code.codes ?? []);
		setSize(String(code.size));
		triggerPrint();
	};

	const handleView = (code: Code) => {
		setCodesView(code.codes ?? []);
		setIsViewModalOpen(true);
	};

	const handleUpload = (newCodes: Code[]) => {
		onChange([...codes, ...newCodes]);
		toast.success("Файлы загружены");
		setIsModalOpen(false);
	};

	return (
		<div className="w-full min-h-[400px] max-h-[550px]">
			<div className="table-layout">
				<div className="table-header flex justify-between items-center">
					<p className="table-header-title">Коды DataMatrix</p>
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer"
					>
						<UploadIcon className="size-5" />
					</button>
				</div>

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
								<th scope="col" className="px-6 py-3 text-start">
									Имя файла
								</th>
								<th scope="col" className="px-6 py-3 text-start">
									Дата загрузки
								</th>
								<th scope="col" className="px-6 py-3 text-start">
									кол-во
								</th>
								<th scope="col" className="px-6 py-3 text-right">
									Действия
								</th>
							</tr>
						</thead>
						<tbody>
							{sortedCodes.length > 0 ? (
								sortedCodes.map((file) => (
									<tr
										key={getCodeIdentity(file)}
										className="bg-white border-b border-gray-200 hover:bg-gray-50"
									>
										<td className="pl-6 pr-2 py-4 font-medium whitespace-nowrap w-0">
											{file.size}
										</td>
										<td className="px-6 py-4 font-medium justify-start items-center text-gray-900 whitespace-nowrap truncate max-w-[100px]">
											{file.fileName}
										</td>
										<td className="px-6 py-4 font-medium justify-start items-center text-gray-900 whitespace-nowrap truncate">
											{file.createdAt
												? new Date(file.createdAt)
													.toLocaleDateString("ru-RU", {
														year: "numeric",
														month: "2-digit",
														day: "2-digit",
														hour: "2-digit",
														minute: "2-digit",
													})
													.replace(",", "")
												: ""}
										</td>
										<td className="px-6 py-4 font-medium justify-start items-center text-gray-900 whitespace-nowrap truncate">
											{file.codes ? file.codes.length : ""}
										</td>
										<td className="px-6 py-4 text-right flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() => handleView(file)}
												className="bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<EyeIcon className="size-5" />
											</button>
											<button
												type="button"
												onClick={() => printTemplate && handlePrint(file)}
												disabled={!printTemplate}
												className={`px-2.5 py-2.5 rounded-md shadow-md ring ring-gray-300 transition-colors ${
													printTemplate
														? "bg-white cursor-pointer"
														: "cursor-not-allowed"
												}`}
											>
												<PrintIcon
													className={`size-5 stroke-2 transition-colors fill-none ${
														printTemplate ? "stroke-blue-500" : ""
													}`}
												/>
											</button>
											<button
												type="button"
												onClick={() => handleDelete(file)}
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
					onClose={() => setIsModalOpen(false)}
					onAdd={handleUpload}
				/>
			)}

			{isDeleteModalOpen && (
				<ConfirmModal
					isOpen={isDeleteModalOpen}
					onCancel={() => setIsDeleteModalOpen(false)}
					onConfirm={() => {
						if (deleteCode) {
							handleConfirmDelete(deleteCode);
						}
						setIsDeleteModalOpen(false);
					}}
					title="Удалить файл?"
					message={`Вы уверены, что хотите удалить файл ${deleteCode?.fileName ?? ""}?`}
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
