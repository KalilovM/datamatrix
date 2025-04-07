import type { IGtinSize } from "@/nomenclature/stores/sizegtinStore";
import { useState } from "react";

interface GtinSizeUploadModalProps {
	onClose: () => void;
	onSave: (gtinSize: IGtinSize) => void;
	gtinSize?: IGtinSize | null;
}

export default function SizeGtinUploadModal({
	onClose,
	onSave,
	gtinSize,
}: GtinSizeUploadModalProps) {
	const [size, setSize] = useState<number>(gtinSize ? gtinSize.size : 0);
	const [gtin, setGtin] = useState<string>(gtinSize ? gtinSize.GTIN : "");

	const handleSubmit = () => {
		const newGtinSize: IGtinSize = {
			size,
			GTIN: gtin,
		};

		onSave(newGtinSize);
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
								type="string"
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
							className="bg-blue-500 px-4 py-2 text-white rounded-md"
						>
							{gtinSize ? "Сохранить" : "Добавить"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
