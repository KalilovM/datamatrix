import type { ICounteragentOption } from "@/orders/create/defenitions";
import { useOrderNomenclatureStore } from "@/orders/stores/useOrderNomenclatureStore";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

function isUUID(str: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		str,
	);
}

export default function OrderEditSelectors({
	orderData,
	selectedCounteragent: initialCounteragent,
	counteragentOptionsProps,
	handleDownloadCSV,
	activeTab,
}: {
	orderData: { id: number; showId: string };
	selectedCounteragent: { label: string; value: string };
	counteragentOptionsProps: ICounteragentOption[];
	handleDownloadCSV: () => void;
	activeTab: number;
}) {
	const router = useRouter();
	const [counteragentOptions] = useState(
		counteragentOptionsProps.map((option) => ({
			label: option.name,
			value: option.id,
		})),
	);
	const { reset, addCodes, codes, getGeneratedCodes } = useOrderStore();
	const { rows, resetRows, updatePreparedOrders } = useOrderNomenclatureStore();
	const [generatedCode, setGeneratedCode] = useState("");
	const [selectedCounteragent, setSelectedCounteragent] = useState<{
		label: string;
		value: string;
	}>(initialCounteragent);
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
		if (!isUUID(aggregatedCode)) {
			const response = await fetch("/api/orders/validate-code", {
				method: "POST",
				body: JSON.stringify({ code: aggregatedCode }),
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			if (!response.ok) {
				toast.error(data.error);
			} else {
				toast.success("Код успешно загружен!");
				addCodes({
					generatedCode: aggregatedCode,
					codes: [data.code],
					nomenclature: data.nomenclature,
				});
				setGeneratedCode("");
				setTimeout(() => {
					inputRef.current?.focus();
				});
			}
		} else {
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
		}
	};

	useEffect(() => {
		updatePreparedOrders(codes);
	}, [codes, updatePreparedOrders]);

	const handleSaveOrder = async () => {
		if (!selectedCounteragent) {
			toast.error("Выберите контрагента перед сохранением!");
			return;
		}

		if (rows.length === 0) {
			toast.error("Нет номенклатур для сохранения!");
			return;
		}
		const invalidRow = rows.find((row) => {
			return (
				row.numberOfOrders <= 0 ||
				row.numberOfPreparedOrders < 0 ||
				row.numberOfPreparedOrders > row.numberOfOrders
			);
		});

		if (invalidRow) {
			toast.error(
				"Проверьте значения в номенклатуре: количество должно быть больше 0, а подготовлено не может превышать заказанное!",
			);
			return;
		}

		try {
			const response = await fetch(`/api/orders/${orderData.id}`, {
				method: "PUT",
				body: JSON.stringify({
					counteragentId: selectedCounteragent.value,
					generatedCodePacks: getGeneratedCodes(),
					rows: rows,
				}),
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || "Ошибка при сохранении заказа");
			} else {
				toast.success("Заказ успешно сохранен!");
				reset();
				resetRows();
				router.push("/orders");
			}
		} catch {
			toast.error("Ошибка сервера. Попробуйте позже.");
		}
	};

	return (
		<div className="gap-4 flex flex-col">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">
					Редактирование заказа {orderData.showId}
				</h1>
				<div className="flex items-center justify-center gap-2">
					<Link
						href="/orders"
						className="bg-gray-500 text-white px-4 py-2 rounded-md self-start"
					>
						Отмена
					</Link>

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
						Сохранить
					</button>
				</div>
			</div>
			<div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-between items-center gap-4">
				<div className="flex flex-row w-full gap-4">
					{activeTab === 1 && (
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
					)}
					{activeTab === 2 && (
						<div className="w-1/2 flex flex-col">
							<label htmlFor="configuration" className="block">
								Отсканируйте код
							</label>
							<input
								ref={inputRef}
								type="text"
								value={generatedCode}
								onChange={(e) => setGeneratedCode(e.target.value)}
								className="border rounded-sm px-1 py-1.5 w-full"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
