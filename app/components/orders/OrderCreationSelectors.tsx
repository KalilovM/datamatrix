import type { ICounteragentOption } from "@/orders/create/defenitions";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function OrderCreationSelectors({
	counteragentOptionsProps,
	onCodesFetched,
	handleDownloadCSV,
	codes,
}: {
	counteragentOptionsProps: ICounteragentOption[];
	onCodesFetched: (codes: string[]) => void;
	handleDownloadCSV: () => void;
	codes: string[];
}) {
	const router = useRouter();
	const [counteragentOptions] = useState(
		counteragentOptionsProps.map((option) => ({
			label: option.name,
			value: option.id,
		})),
	);
	const [isSaving, setIsSaving] = useState(false);

	const [selectedCounteragent, setSelectedCounteragent] = useState<{
		label: string;
		value: string;
	} | null>(null);

	const [generatedCode, setGeneratedCode] = useState<string>("");
	const [debouncedGeneratedCode, setDebouncedGeneratedCode] =
		useState<string>("");
	const [listDebouncedGeneratedCodes, setListDebouncedGeneratedCodes] =
		useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Ref for focusing input
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedGeneratedCode(generatedCode);
		}, 200);

		return () => clearTimeout(handler); // Cleanup timeout on every change
	}, [generatedCode]);

	// Validate when the debounced value updates
	useEffect(() => {
		if (debouncedGeneratedCode) {
			validateCode(debouncedGeneratedCode);
		}
	}, [debouncedGeneratedCode]);

	const handleCounteragentChange = (option: {
		label: string;
		value: string;
	}) => {
		setSelectedCounteragent(option);
	};

	const validateCode = async (code: string) => {
		if (!code) return;

		try {
			const response = await fetch("/api/orders/validate-generated-code", {
				method: "POST",
				body: JSON.stringify({ generatedCode: code }),
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();
			if (!response.ok) {
				toast.error(data.error);
				onCodesFetched([]);
			} else {
				toast.success("Коды успешно загружены!");
				onCodesFetched((prevCodes: string[]) => [
					...prevCodes,
					...data.linkedCodes.map((c: { value: string }) => c.value),
				]);
				setListDebouncedGeneratedCodes((prevCodes: string[]) => [
					...prevCodes,
					generatedCode,
				]);
				setGeneratedCode("");

				setTimeout(() => {
					inputRef.current?.focus();
				}, 0);
			}
		} catch {
			toast.error("Ошибка сервера. Попробуйте позже.");
			onCodesFetched([]);
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

		setIsSaving(true);

		try {
			const response = await fetch("/api/orders/", {
				method: "POST",
				body: JSON.stringify({
					counteragentId: selectedCounteragent.value,
					generatedCodePacks: listDebouncedGeneratedCodes,
				}),
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || "Ошибка при сохранении заказа");
			} else {
				toast.success("Заказ успешно сохранен!");
				onCodesFetched([]);
				router.push("/orders");
			}
		} catch {
			toast.error("Ошибка сервера. Попробуйте позже.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="gap-4 flex flex-col">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">Новый Заказ</h1>
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={handleDownloadCSV}
						className="bg-green-500 text-white px-4 py-2 rounded-md self-start"
					>
						Скачать коды (CSV)
					</button>
					<button
						onClick={handleSaveOrder}
						disabled={isSaving}
						className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
							isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
						}`}
					>
						{isSaving ? "Сохранение..." : "Сохранить заказ"}
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
						{error && <p className="text-red-500 text-sm">{error}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
