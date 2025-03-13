"use client";

import { useNomenclatureStore } from "@/nomenclature/model/store";
import { usePrintStore } from "@/shared/store/printStore";
import { BinIcon, EyeIcon, PrintIcon, UploadIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { CodeViewModal } from "./CodeViewModal";
import CodesUploadModal from "./CodesUploadModal";

export interface Code {
	fileName: string;
	content: string;
	id: string;
	codes: string[];
}

interface CodeTableProps {
	value?: Code[]; // the controlled array of codes
	onChange: (value: Code[]) => void; // callback to update codes
}

export default function CodeTable({ value = [], onChange }: CodeTableProps) {
	const codes = value;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [codesView, setCodesView] = useState<string[]>([]);

	// We still use the print store to set codes and trigger printing.
	const { setPrintCodes, triggerPrint } = usePrintStore();
	// And we read the printTemplate from the nomenclature store.
	const { printTemplate } = useNomenclatureStore();

	const handleDelete = (fileName: string) => {
		const updated = codes.filter((code) => code.fileName !== fileName);
		onChange(updated);
		toast.success("Файл удален");
	};

	const handlePrint = (fileName: string) => {
		const code = codes.find((code) => code.fileName === fileName);
		if (code) {
			setPrintCodes(code.codes);
			triggerPrint();
		}
	};

	const handleView = (fileName: string) => {
		const code = codes.find((code) => code.fileName === fileName);
		if (code) {
			setCodesView(code.codes);
			setIsViewModalOpen(true);
		}
	};

	const handleUpload = (newCodes: Code[]) => {
		onChange([...codes, ...newCodes]);
		toast.success("Файлы загружены");
		setIsModalOpen(false);
	};

	return (
		<div className="w-1/2">
			<div className="table-layout">
				{/* Table Header */}
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

				{/* Table Rows */}
				<div className="table-rows-layout relative overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
							<tr>
								<th scope="col" className="px-6 py-3">
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
										<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap truncate max-w-xs">
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
											{/* Conditionally render the print button if a print template exists */}
											<button
												type="button"
												onClick={() =>
													printTemplate && handlePrint(file.fileName)
												}
												disabled={!printTemplate}
												className={`px-2.5 py-2.5 rounded-md shadow-md ring ring-gray-300 transition-colors
                          ${printTemplate ? "bg-white cursor-pointer" : "cursor-not-allowed"}`}
											>
												<PrintIcon
													className={`size-5 stroke-2 transition-colors fill-none
                            ${printTemplate ? "stroke-blue-500" : ""}`}
												/>
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
									<td colSpan={2} className="text-center py-4 text-gray-500">
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
			<CodeViewModal
				codes={codesView}
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
			/>
		</div>
	);
}
