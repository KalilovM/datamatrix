import { BinIcon, UploadIcon } from "@/shared/ui/icons";
import { EyeIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { CodeViewModal } from "../edit/CodeViewModal";
import CodesUploadModal from "./CodesUploadModal";

export interface Code {
	fileName: string;
	content: string;
}

// New interface for parsed CSV files.
interface ParsedCode {
	fileName: string;
	codes: string[];
}

interface CodeTableProps {
	value?: Code[]; // the controlled array of code files
	onChange: (value: Code[]) => void; // callback to update codes
}

export default function CodeTable({ value = [], onChange }: CodeTableProps) {
	const codes = value;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	// Use ParsedCode[] to store each file’s parsed codes.
	const [codesList, setCodesList] = useState<ParsedCode[]>([]);
	// This will hold the list of codes for the file being viewed.
	const [codesView, setCodesView] = useState<string[]>([]);

	const handleDelete = (fileName: string) => {
		const updated = codes.filter((code) => code.fileName !== fileName);
		onChange(updated);
		// Also remove the file from our parsed state.
		setCodesList((prev) => prev.filter((file) => file.fileName !== fileName));
		toast.success("Файл удален");
	};

	// When new code files are uploaded, we parse their CSV content.
	const handleUpload = (newCodes: Code[]) => {
		onChange([...codes, ...newCodes]);

		// For each new code file, split the CSV content by new lines,
		// trim each row, and filter out any empty rows.
		const parsed = newCodes.map((newCode) => {
			const lines = newCode.content
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter((line) => line.length > 0);
			return { fileName: newCode.fileName, codes: lines };
		});
		// Append the new parsed files to the existing codesList.
		setCodesList((prev) => [...prev, ...parsed]);
		setIsModalOpen(false);
	};

	// When the view button is clicked, find the parsed file by fileName
	// and set the codesView state for display in the modal.
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
		<div className="w-1/2">
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
