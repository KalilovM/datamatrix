import { BinIcon, CloseIcon, UploadIcon } from "@/shared/ui/icons";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { Code } from "./CodeTable";

interface CodesUploadModalProps {
	onClose: () => void;
	// Now onAdd receives an array of codes
	onAdd: (codes: Code[]) => void;
}

export default function CodesUploadModal({
	onClose,
	onAdd,
}: CodesUploadModalProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setSelectedFiles([...selectedFiles, ...Array.from(e.dataTransfer.files)]);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
		}
	};

	const handleRemoveFile = (index: number) => {
		setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			toast.error("Выберите CSV файл для загрузки.");
			return;
		}

		const invalidFile = selectedFiles.find(
			(file) => !file.name.toLowerCase().endsWith(".csv"),
		);
		if (invalidFile) {
			toast.error(`Файл ${invalidFile.name} не является CSV.`);
			return;
		}

		// Read each file using Promise.all
		const readPromises = selectedFiles.map((file) => {
			return new Promise<Code>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					const content = event.target?.result;
					if (typeof content === "string") {
						resolve({ fileName: file.name, content });
						toast.success(`Файл ${file.name} загружен!`);
					} else {
						reject(new Error(`Невалидный контент в файле ${file.name}`));
					}
				};
				reader.onerror = () => {
					reject(new Error(`Ошибка чтения файла ${file.name}`));
				};
				reader.readAsText(file);
			});
		});

		try {
			const newCodes = await Promise.all(readPromises);
			onAdd(newCodes);
		} catch (error: any) {
			toast.error(error.message);
		}

		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white p-6 rounded-lg w-1/2 relative">
				<button
					type="button"
					className="absolute top-2 right-5 text-gray-600 hover:text-gray-800"
					onClick={onClose}
				>
					<CloseIcon className="h-6 w-6" />
				</button>
				<div className="space-y-4 pt-4">
					<div
						className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50"
						onDrop={handleDrop}
						onDragOver={handleDragOver}
					>
						<UploadIcon className="h-12 w-12 text-gray-500" />
						<p className="mt-2 text-sm text-gray-500">
							Перетащите CSV файл сюда или нажмите, чтобы выбрать
						</p>
						<input
							type="file"
							name="files"
							accept=".csv"
							multiple
							className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
							onChange={handleFileChange}
							ref={fileInputRef}
						/>
					</div>

					{selectedFiles.length > 0 && (
						<ul className="space-y-2">
							{selectedFiles.map((file, index) => (
								<li
									key={file.name}
									className="flex items-center justify-between rounded-lg border bg-gray-50 p-2"
								>
									<span className="text-sm text-gray-700">{file.name}</span>
									<button
										type="button"
										onClick={() => handleRemoveFile(index)}
										className="text-red-500 hover:text-red-700"
									>
										<BinIcon className="h-5 w-5" />
									</button>
								</li>
							))}
						</ul>
					)}

					<button
						type="button"
						disabled={selectedFiles.length === 0}
						onClick={handleUpload}
						className={`mt-4 w-full rounded-md px-4 py-2 text-white ${
							selectedFiles.length === 0
								? "cursor-not-allowed bg-gray-400"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
					>
						Загрузить
					</button>
				</div>
			</div>
		</div>
	);
}
