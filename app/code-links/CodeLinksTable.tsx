"use client";

import type { NomenclatureOption } from "@/aggregation/model/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
	onLinkedCodes: (codes: string[]) => void;
	onNomenclature: (nom: NomenclatureOption | null) => void;
}

export default function CodeLinksTable({
	onLinkedCodes,
	onNomenclature,
}: Props) {
	const [inputCode, setInputCode] = useState("");
	const [modelArticle, setModelArticle] = useState("");

	useEffect(() => {
		if (!inputCode) {
			onLinkedCodes([]);
			return;
		}
		const timeout = setTimeout(async () => {
			try {
				const response = await fetch("/api/code-links", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code: inputCode }),
				});
				const data = await response.json();
				console.log("Response data:", data);
				if (!response.ok) {
					console.log("Error response:", data);
					toast.error(data.error);
					onLinkedCodes([]);
					onNomenclature(null);
					setModelArticle("");
				} else {
					setModelArticle(
						data.generatedCodePack.nomenclature?.modelArticle || "",
					);
					onNomenclature(data.generatedCodePack.nomenclature || null);
					onLinkedCodes([
						data.generatedCodePack.generatedCodePack,
						...data.generatedCodePack.codes.map(
							(c: { value: string }) => c.value,
						),
					]);
				}
			} catch {
				toast.error("Ошибка сервера. Попробуйте позже.");
				onLinkedCodes([]);
			}
		}, 1000);
		return () => clearTimeout(timeout);
	}, [inputCode, onLinkedCodes, onNomenclature]);

	return (
		<div className="w-full gap-4 flex flex-col print:hidden">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">Датаматрикс Коды</h1>
			</div>
			<div className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
				<div className="w-1/2 flex flex-col">
					<label htmlFor="code">Код</label>
					<input
						id="code"
						type="text"
						name="code"
						placeholder="Вставьте код"
						value={inputCode}
						onChange={(e) => setInputCode(e.target.value)}
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>
				</div>
				<div className="w-1/2 flex flex-col">
					<label htmlFor="modelArticle">Модель</label>
					<input
						id="modelArticle"
						type="text"
						readOnly
						value={modelArticle}
						className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
					/>
				</div>
			</div>
		</div>
	);
}
