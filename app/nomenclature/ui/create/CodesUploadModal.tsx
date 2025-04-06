import { BinIcon, CloseIcon, UploadIcon } from "@/shared/ui/icons";
import {
	type ChangeEvent,
	type DragEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "react-toastify";
import type { Code } from "./CodeTable";

interface CodesUploadModalProps {
	onClose: () => void;
	onAdd: (codes: Code[]) => void;
	codes: ParsedCode[];
}

interface ParsedCode {
	fileName: string;
	codes: string[];
	size: number;
	GTIN: string;
}

export default function CodesUploadModal({
	onClose,
	onAdd,
	codes,
}: CodesUploadModalProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [sizeInput, setSizeInput] = useState<string>("");
	const [gtin, setGtin] = useState<string>("");
	const [isGtinDisabled, setIsGtinDisabled] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const existingCode = codes.find(
			(code) => Number(code.size) === Number(sizeInput),
		);
		if (existingCode) {
			setGtin(existingCode.GTIN);
			setIsGtinDisabled(true);
		} else {
			setGtin("");
			setIsGtinDisabled(false);
		}
	}, [sizeInput, codes]);

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files.length > 0) {
			setSelectedFile(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			toast.error("Выберите CSV файл для загрузки.");
			return;
		}

		if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
			toast.error(`Файл ${selectedFile.name} не является CSV.`);
			return;
		}

		if (!sizeInput.trim()) {
			toast.error("Введите размер.");
			return;
		}

		try {
			const content = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					const result = event.target?.result;
					if (typeof result === "string") {
						resolve(result);
					} else {
						reject(new Error("Ошибка чтения файла."));
					}
				};
				reader.onerror = () => {
					reject(new Error("Ошибка чтения файла."));
				};
				reader.readAsText(selectedFile);
			});

			const code: Code = {
				fileName: selectedFile.name,
				content,
				size: sizeInput,
				GTIN: gtin,
			};

			onAdd([code]);
			toast.success(`Файл ${selectedFile.name} загружен!`);
			onClose();
		} catch (error: any) {
			toast.error(error.message);
		}
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
							name="file"
							accept=".csv"
							className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
							onChange={handleFileChange}
							ref={fileInputRef}
						/>
					</div>

					{selectedFile && (
						<div className="flex items-center justify-between rounded-lg border bg-gray-50 p-2">
							<span className="text-sm text-gray-700">{selectedFile.name}</span>
							<button
								type="button"
								onClick={handleRemoveFile}
								className="text-red-500 hover:text-red-700"
							>
								<BinIcon className="h-5 w-5" />
							</button>
						</div>
					)}

					<input
						type="number"
						name="size"
						placeholder="Введите размер"
						value={sizeInput}
						onChange={(e) => setSizeInput(e.target.value)}
						className="mt-4 w-full rounded-md px-4 py-2 bg-white border border-gray-300"
					/>
					<input
						type="string"
						name="gtin"
						placeholder="Введите GTIN"
						value={gtin}
						onChange={(e) => setGtin(e.target.value)}
						disabled={isGtinDisabled}
						className={`mt-4 w-full rounded-md px-4 py-2 border ${
							isGtinDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
						} border-gray-300`}
					/>

					<button
						type="button"
						disabled={!selectedFile || !sizeInput.trim()}
						onClick={handleUpload}
						className={`mt-4 w-full rounded-md px-4 py-2 text-white ${
							!selectedFile || !sizeInput.trim()
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
