import {
	type IGtinSize,
	useGtinSizeStore,
} from "@/nomenclature/stores/sizegtinStore";
import { useState } from "react";
import { toast } from "react-toastify";

interface GtinSizeUploadModalProps {
	onClose: () => void;
	onSave: (newGtinSize: IGtinSize, oldGtin?: string, oldSize?: number) => void;
	gtinSize?: IGtinSize | null;
}

export default function SizeGtinUploadModal({
	onClose,
	onSave,
	gtinSize,
}: GtinSizeUploadModalProps) {
	const { gtinSize: gtinSizeList } = useGtinSizeStore();
	const [size, setSize] = useState<string>(gtinSize ? gtinSize.size : "");
	const [gtin, setGtin] = useState<string>(gtinSize ? gtinSize.GTIN : "");

	const handleSubmit = () => {
		const trimmedGtin = gtin.trim();

		if (!trimmedGtin || Number.parseInt(size) <= 0) {
			toast.error("Пожалуйста, заполните все поля корректно.");
			return;
		}

		const isDuplicate = gtinSizeList.some((item) =>
			gtinSize && item.GTIN === gtinSize.GTIN && item.size === gtinSize.size
				? false
				: item.GTIN === trimmedGtin || item.size === Number.parseInt(size),
		);

		if (isDuplicate) {
			toast.error("Такая комбинация GTIN и размера уже существует.");
			return;
		}

		const newGtinSize: IGtinSize = {
			size: Number.parseInt(size),
			GTIN: trimmedGtin,
		};

		onSave(newGtinSize, gtinSize?.GTIN, gtinSize?.size);

		setSize("");
		setGtin("");
		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<div className="bg-white p-8 rounded-lg w-1/3">
				<h2 className="text-xl font-bold mb-4">
					{gtinSize ? "Редактировать размер" : "Добавить размер"}
				</h2>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between items-center gap-4">
						<div className="w-full">
							<label htmlFor="size" className="block mb-1">
								Размер:
							</label>
							<input
								name="size"
								type="number"
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
								className="w-full border rounded-lg px-3 py-2"
								required
							/>
						</div>
						<div className="w-full">
							<label htmlFor="GTIN" className="block mb-1">
								GTIN:
							</label>
							<input
								name="GTIN"
								type="text"
								value={gtin}
								onChange={(e) => setGtin(e.target.value)}
								className="w-full border rounded-lg px-3 py-2"
								required
							/>
						</div>
					</div>
					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-300 px-4 py-2 rounded-md"
						>
							Отмена
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!gtin.trim() || size <= 0}
							className={`px-4 py-2 rounded-md text-white ${
								!gtin.trim() || size <= 0
									? "bg-blue-300 cursor-not-allowed"
									: "bg-blue-500"
							}`}
						>
							{gtinSize ? "Сохранить" : "Добавить"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
