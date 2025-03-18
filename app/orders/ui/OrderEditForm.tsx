import type { ICounteragentOption } from "@/orders/create/defenitions";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useEffect } from "react";
import { useOrderEditStore } from "../stores/useOrderEditStore";
import OrderEditCodesList from "./OrderEditCodesList";
import OrderEditGeneratedCodesList from "./OrderEditGeneratedCodesList";
import OrderEditSelectors from "./OrderEditSelectors";

interface aggregatedCodesType {
	id: string;
	codes: string[];
	value: string;
	nomenclature: string;
}

interface InitialDataType {
	initialSelectedCounteragent: { label: string; value: string };
	initialAggregatedCodes: aggregatedCodesType[];
}

export default function OrderEditForm({
	id,
	counteragentOptions,
	initialData,
}: {
	id: string;
	counteragentOptions: ICounteragentOption[];
	initialData: InitialDataType;
}) {
	const { setCodes, reset, getCodesRawData } = useOrderEditStore();

	useEffect(() => {
		reset();
		setCodes(
			initialData.initialAggregatedCodes.map((code) => ({
				generatedCode: code.value,
				nomenclature: code.nomenclature,
				codes: code.codes,
			})),
		);
	}, [initialData, setCodes]);

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
			<OrderEditSelectors
				orderId={id}
				initialSelectedCounteragent={initialData.initialSelectedCounteragent}
				counteragentOptionsProps={counteragentOptions}
				handleDownloadCSV={handleDownloadCSV}
			/>
			<div className="flex flex-row w-full gap-4 h-full">
				<OrderEditGeneratedCodesList />
				<OrderEditCodesList />
			</div>
		</div>
	);
}
