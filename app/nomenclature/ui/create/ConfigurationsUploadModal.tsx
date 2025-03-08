import { useState } from "react";
import { toast } from "react-toastify";

export interface ConfigurationOption {
	label: string;
	value: {
		pieceInPack: number;
		packInPallet: number;
	};
}

interface ConfigurationsUploadModalProps {
	onClose: () => void;
	onSave: (config: ConfigurationOption) => void;
	config?: ConfigurationOption | null;
}

export default function ConfigurationsUploadModal({
	onClose,
	onSave,
	config,
}: ConfigurationsUploadModalProps) {
	const [pieceInPack, setPieceInPack] = useState<number>(
		config ? config.value.pieceInPack : 1,
	);
	const [packInPallet, setPackInPallet] = useState<number>(
		config ? config.value.packInPallet : 1,
	);

	const handleSubmit = () => {
		if (pieceInPack <= 0 || packInPallet <= 0) {
			toast.error("Значения должны быть положительными числами.");
			return;
		}

		const newConfig: ConfigurationOption = {
			label: `1-${pieceInPack}-${packInPallet}`,
			value: {
				pieceInPack,
				packInPallet,
			},
		};

		onSave(newConfig);
		toast.success(
			config ? "Конфигурация обновлена!" : "Конфигурация добавлена!",
		);
		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<div className="bg-white p-8 rounded-lg w-1/3">
				<h2 className="text-xl font-bold mb-4">
					{config ? "Редактировать конфигурацию" : "Добавить конфигурацию"}
				</h2>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row gap-4">
						<div>
							<label htmlFor="pack" className="block mb-1">
								Штучек в упаковке:
							</label>
							<input
								name="pack"
								type="number"
								value={pieceInPack}
								onChange={(e) => setPieceInPack(Number(e.target.value))}
								className="w-full border rounded-lg px-3 py-2"
								required
							/>
						</div>
						<div>
							<label htmlFor="pallet" className="block mb-1">
								Упаковок в паллете:
							</label>
							<input
								name="pallet"
								type="number"
								value={packInPallet}
								onChange={(e) => setPackInPallet(Number(e.target.value))}
								className="w-full border rounded-lg px-3 py-2"
								required
							/>
						</div>
					</div>
					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-400 px-4 py-2 rounded-md"
						>
							Отмена
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							className="bg-blue-500 px-4 py-2 text-white rounded-md"
						>
							{config ? "Сохранить" : "Добавить"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
