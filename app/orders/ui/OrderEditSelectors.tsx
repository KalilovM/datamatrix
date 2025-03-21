import type { ICounteragentOption } from "@/orders/create/defenitions";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useOrderEditStore } from "../stores/useOrderEditStore";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function OrderEditSelectors({
	orderId,
	initialSelectedCounteragent,
	counteragentOptionsProps,
	handleDownloadCSV,
}: {
	orderId: string;
	initialSelectedCounteragent: { label: string; value: string };
	counteragentOptionsProps: ICounteragentOption[];
	handleDownloadCSV: () => void;
}) {
	const router = useRouter();
	const [counteragentOptions] = useState(
		counteragentOptionsProps.map((option) => ({
			label: option.name,
			value: option.id,
		})),
	);
	const { reset, addCodes, codes, getGeneratedCodes } = useOrderEditStore();
	const [generatedCode, setGeneratedCode] = useState("");
	const [selectedCounteragent, setSelectedCounteragent] = useState<{
		label: string;
		value: string;
	}>(initialSelectedCounteragent);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			validateCode(generatedCode.trim());
		}, 300);
		return () => clearTimeout(timer);
	});

	const handleCounteragentChange = (option: {
		label: string;
		value: string;
	}) => {
		setSelectedCounteragent(option);
	};

	const validateCode = async (code: string) => {
		if (!code) return;
		const aggregatedCode = code.trim();
		try {
			const response = await fetch("/api/orders/validate-generated-code", {
				method: "POST",
				body: JSON.stringify({ generatedCode: aggregatedCode }),
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();
			if (!response.ok) {
				toast.error(data.error);
			} else {
				toast.success("Коды успешно загружены!");
				console.log(data);
				addCodes({
					generatedCode: aggregatedCode,
					codes: data.linkedCodes.map((code: string) => code.value),
					nomenclature: data.nomenclature,
				});
				setGeneratedCode("");

				setTimeout(() => {
					inputRef.current?.focus();
				}, 0);
			}
		} catch {
			toast.error("Ошибка сервера. Попробуйте позже.");
		}
	};

	const handleSaveOrder = async () => {
		if (!selectedCounteragent) {
			toast.error("Выберите контрагента перед сохранением!");
			return;
		}

		if (codes.length === 0) {
			toast.error("Нет кодов для сохранения!");
			return;
		}

		console.log(getGeneratedCodes());

		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: "PUT",
				body: JSON.stringify({
					counteragentId: selectedCounteragent.value,
					generatedCodePacks: getGeneratedCodes(),
				}),
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || "Ошибка при обновлении заказа");
			} else {
				toast.success("Заказ успешно сохрано обновлен!");
				reset();
				router.push("/orders");
			}
		} catch {
			toast.error("Ошибка сервера. Попробуйте позже.");
		}
	};

	return (
		<div className="gap-4 flex flex-col">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">Новый Заказ</h1>
				<div className="flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={handleDownloadCSV}
						className="bg-green-500 text-white px-4 py-2 rounded-md self-start"
					>
						Скачать коды (CSV)
					</button>
					<button
						type="button"
						onClick={handleSaveOrder}
						className={"bg-blue-500 text-white px-4 py-2 rounded-md"}
					>
						Сохранить заказ
					</button>
				</div>
			</div>
			<div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-between items-center gap-4">
				<div className="flex flex-row w-full gap-4">
					<div className="w-1/2 flex flex-col">
						<label htmlFor="nomenclature" className="block">
							Контрагент
						</label>
						<Select
							options={counteragentOptions}
							value={selectedCounteragent}
							onChange={(option) =>
								handleCounteragentChange(
									option as { label: string; value: string },
								)
							}
							placeholder="Выберите контрагента"
						/>
					</div>
					<div className="w-1/2 flex flex-col">
						<label htmlFor="configuration" className="block">
							Агрегированный код
						</label>
						<input
							ref={inputRef}
							type="text"
							value={generatedCode}
							onChange={(e) => setGeneratedCode(e.target.value)}
							className="border rounded-sm px-1 py-1.5 w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
