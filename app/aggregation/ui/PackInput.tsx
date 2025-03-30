"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCheckCode } from "../api/checkCodeApi";
import { useAggregationPackStore } from "../store/aggregationPackStore";

interface PackInputProps {
	index: number;
	value: string;
}

export default function PackInput({ index, value }: PackInputProps) {
	const { updatePackValue, pages, currentPage } = useAggregationPackStore();
	const [inputValue, setInputValue] = useState(value);
	const [isScanned, setIsScanned] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const checkCodeMutation = useCheckCode();

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		updatePackValue(index, newValue);
		validateCode(newValue);
	};

	const validateCode = (code: string) => {
		if (pages[currentPage]?.uniqueCode) return;

		checkCodeMutation.mutate(code, {
			onSuccess: (exists) => {
				if (!exists) {
					setInputValue("");
					setIsScanned(false);
					updatePackValue(index, "");
					toast.error("Код не найден в базе данных!");
					if (inputRef.current) {
						inputRef.current.focus();
					}
				} else {
					const currentPackValues = pages[currentPage]?.packValues || [];
					const isDuplicate = currentPackValues.some(
						(val, i) => i !== index && val === code,
					);
					if (isDuplicate) {
						toast.error("Значение уже существует в пачке");
						setInputValue("");
						updatePackValue(index, "");
						if (inputRef.current) {
							inputRef.current.focus();
						}
						return;
					}
					const nextInput = document.querySelector<HTMLInputElement>(
						`input[data-index="${index + 1}"]`,
					);
					if (nextInput) {
						nextInput.focus();
					}
				}
			},
			onError: () => {
				toast.error("Ошибка при проверке кода");
			},
		});
	};

	const handleClear = () => {
		setInputValue("");
		setIsScanned(false);
		updatePackValue(index, "");
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<div className="flex items-center w-full">
			<input
				ref={inputRef}
				type="text"
				value={inputValue}
				onChange={handleChange}
				readOnly={isScanned}
				placeholder="Отсканируйте код"
				className="border rounded px-2 py-2 w-full"
				data-index={index}
			/>
			<button
				type="button"
				onClick={handleClear}
				className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
			>
				Очистить
			</button>
		</div>
	);
}
