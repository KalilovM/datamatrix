"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DisaggregationForm() {
	const [generatedCode, setGeneratedCode] = useState<string>("");
	const [codes, setCodes] = useState<{ id: string; value: string }[]>([]);
	const [isExisting, setIsExisting] = useState<boolean>(false);

	// Checks if the generated code exists and retrieves its linked codes
	const checkGeneratedCode = async () => {
		if (!generatedCode) return;
		try {
			const response = await fetch(
				`/api/dissaggregation?code=${generatedCode}`,
			);
			const data = await response.json();
			if (response.ok) {
				setIsExisting(true);
				setCodes(data.codes);
				toast.success("Загружены связанные коды");
			} else {
				setIsExisting(false);
				setCodes([]);
				toast.error("DataMatrix код не найден");
			}
		} catch (error) {
			console.error(error);
			toast.error("Ошибка сервера");
		}
	};

	// Updates a specific code input field
	const handleCodeChange = (index: number, newValue: string) => {
		const updatedCodes = [...codes];
		updatedCodes[index].value = newValue;
		setCodes(updatedCodes);
	};

	// Clears the content of one input
	const clearCode = (index: number) => {
		handleCodeChange(index, "");
	};

	// Saves the updated codes to the database via API
	const handleSave = async () => {
		try {
			// before sending check if all fields are filled
			if (!generatedCode || !codes.every((c) => c.value)) {
				toast.error("Не заполнены все поля");
				return;
			}
			const response = await fetch("/api/dissaggregation", {
				method: "PUT", // or POST depending on your design
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code: generatedCode, codes }),
			});
			if (response.ok) {
				toast.success("Коды обновлены");
			} else {
				toast.error("Ошибка сохранения кодов");
			}
		} catch (error) {
			console.error(error);
			toast.error("Ошибка сервера");
		}
	};

	const handleDisaggregation = async () => {
		try {
			// Before sending, check if all fields are filled
			if (!generatedCode || !codes.every((c) => c.value)) {
				toast.error("Не заполнены все поля");
				return;
			}

			const response = await fetch("/api/dissaggregation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code: generatedCode }),
			});

			if (response.ok) {
				toast.success("Коды разагрегированы успешно");
				setCodes([]);
				setGeneratedCode("");
			} else {
				toast.error("Ошибка разагрегации кодов");
			}
		} catch (error) {
			console.error(error);
			toast.error("Ошибка сервера");
		}
	};

	return (
		<div className="flex flex-col w-full h-full gap-4">
			<div className="flex flex-row justify-between items-center">
				<h1 className="leading-6 text-xl font-bold">Разагрегация</h1>
				<div className="flex flex-row justify-center items-center gap-4">
					{generatedCode && codes.every((c) => c.value) && (
						<button
							type="button"
							onClick={handleDisaggregation}
							className="bg-red-500 px-2.5 py-1.5 text-white rounded-md"
						>
							Разагрегировать
						</button>
					)}
					<button
						type="button"
						onClick={handleSave}
						className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
					>
						Сохарнить
					</button>
				</div>
			</div>
			<div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-center items-start gap-4">
				<div className="w-1/2 flex flex-col">
					<label htmlFor="generatedCode" className="block">
						Агрегированный код
					</label>
					<input
						name="generatedCode"
						required
						className="w-full rounded-lg border px-3 py-2 text-gray-700 border-gray-300"
						type="text"
						value={generatedCode}
						onChange={(e) => setGeneratedCode(e.target.value)}
						onBlur={checkGeneratedCode} // You can also trigger this via a button if you prefer
					/>
				</div>
			</div>
			<div className="flex flex-col w-full h-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-start items-start gap-4">
				<h2 className="leading-6 text-xl font-bold">Связанные коды</h2>
				{codes.map((code, index) => (
					<div key={code.id} className="flex gap-2 items-center w-full">
						<input
							type="text"
							className="rounded-lg border px-3 py-2 text-gray-700 border-gray-300 w-full"
							value={code.value}
							onChange={(e) => handleCodeChange(index, e.target.value)}
						/>
						<button
							type="button"
							onClick={() => clearCode(index)}
							className="bg-red-500 text-white px-3 py-2 rounded"
						>
							Очистить
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
