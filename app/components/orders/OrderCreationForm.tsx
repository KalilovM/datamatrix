"use client";

import type { ICounteragentOption } from "@/orders/create/defenitions";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useState } from "react";
import OrderCodesList from "./OrderCodesList";
import OrderCreationSelectors from "./OrderCreationSelectors";
import OrderGeneratedCodesList from "./OrderGeneratedCodesList";
import OrderNomenclatures from "./OrderNomenclatures";

export default function OrderCreationForm({
	counteragentOptions,
}: {
	counteragentOptions: ICounteragentOption[];
}) {
	const { getCodesRawData } = useOrderStore();
	const [activeTab, setActiveTab] = useState(1);

	const handleDownloadCSV = () => {
		const codes = getCodesRawData();
		if (codes.length === 0) {
			alert("Нет кодов для скачивания!");
			return;
		}

		const csv = Papa.unparse(
			codes.map((code) => [code]),
			{ header: false },
		);

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "order_codes.csv");
	};

	return (
		<div className="flex flex-col w-full h-full gap-4">
			<OrderCreationSelectors
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
						Вкладка 1
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
						Вкладка 2
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
