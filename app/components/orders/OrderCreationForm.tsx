"use client";

import type { ICounteragentOption } from "@/orders/create/defenitions";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import OrderCodesList from "./OrderCodesList";
import OrderCreationSelectors from "./OrderCreationSelectors";
import OrderGeneratedCodesList from "./OrderGeneratedCodesList";

export default function OrderCreationForm({
	counteragentOptions,
}: {
	counteragentOptions: ICounteragentOption[];
}) {
	const { getCodesRawData } = useOrderStore();

	const handleDownloadCSV = () => {
		const codes = getCodesRawData();
		if (codes.length === 0) {
			alert("Нет кодов для скачивания!");
			return;
		}

		// Convert codes into CSV format (each code in a new row)
		const csv = Papa.unparse(
			codes.map((code) => [code]),
			{ header: false },
		);

		// Convert CSV string into a Blob and trigger download
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "order_codes.csv");
	};

	return (
		<div className="flex flex-col w-full h-full gap-4">
			<OrderCreationSelectors
				counteragentOptionsProps={counteragentOptions}
				handleDownloadCSV={handleDownloadCSV}
			/>
			<div className="flex flex-row w-full gap-4 h-full">
				<OrderGeneratedCodesList />
				<OrderCodesList />
			</div>
		</div>
	);
}
