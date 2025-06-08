"use client";

import type { ICounteragentOption } from "@/orders/create/definitions";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useState } from "react";
import OrderCodesList from "./OrderCodesList";
import OrderEditSelectors from "./OrderEditSelectors";
import OrderGeneratedCodesList from "./OrderGeneratedCodesList";
import OrderNomenclatures from "./OrderNomenclatures";

interface IinitialCounteragent {
	label: string;
	value: string;
}

export default function OrderCreationForm({
	orderData,
	counteragentOptions,
	selectedCounteragent,
}: {
	orderData: { id: number; showId: string; counteragent: string };
	counteragentOptions: ICounteragentOption[];
	selectedCounteragent: IinitialCounteragent;
}) {
	const { getCodesRawData } = useOrderStore();
	const [activeTab, setActiveTab] = useState(1);

	const handleDownloadCSV = async () => {
		const codes = getCodesRawData();
		if (codes.length === 0) {
			alert("Нет кодов для скачивания!");
			return;
		}

		const csv = Papa.unparse(
			codes.map((code) => [code]),
			{ header: false },
		);

		const today = new Date();
		const day = String(today.getDate()).padStart(2, "0");
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = today.getFullYear();
		const formattedDate = `${day}.${month}.${year}`;

		const filename = `${orderData.showId}-${selectedCounteragent.label}-от-${formattedDate}.csv`;

		// Use File System Access API if available
		if ("showSaveFilePicker" in window) {
			try {
				const fileHandle = await window.showSaveFilePicker({
					suggestedName: filename,
					types: [
						{
							description: "CSV file",
							accept: { "text/csv": [".csv"] },
						},
					],
				});
				const writable = await fileHandle.createWritable();
				await writable.write(
					new Blob([csv], { type: "text/csv;charset=utf-8;" }),
				);
				await writable.close();
				return;
			} catch (err) {
				console.log("File save cancelled or failed", err);
			}
		}

		// Fallback for unsupported browsers
		// saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
	};

	return (
		<div className="flex flex-col w-full h-full gap-4">
			<OrderEditSelectors
				orderData={orderData}
				selectedCounteragent={selectedCounteragent}
				counteragentOptionsProps={counteragentOptions}
				handleDownloadCSV={handleDownloadCSV}
				activeTab={activeTab}
			/>

			<ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
				<li className="me-2">
					<button
						type="button"
						onClick={() => setActiveTab(1)}
						className={`inline-block px-4 py-3 rounded-lg ${
							activeTab === 1
								? "text-white bg-blue-600"
								: "hover:text-gray-900 hover:bg-gray-100"
						}`}
					>
						Шаг 1
					</button>
				</li>
				<li className="me-2">
					<button
						type="button"
						onClick={() => setActiveTab(2)}
						className={`inline-block px-4 py-3 rounded-lg ${
							activeTab === 2
								? "text-white bg-blue-600"
								: "hover:text-gray-900 hover:bg-gray-100"
						}`}
					>
						Шаг 2
					</button>
				</li>
			</ul>

			<div className="w-full h-full">
				{activeTab === 1 && <OrderNomenclatures />}
				{activeTab === 2 && (
					<div className="flex flex-row w-full gap-4 h-full">
						<OrderGeneratedCodesList />
						<OrderCodesList />
					</div>
				)}
			</div>
		</div>
	);
}
