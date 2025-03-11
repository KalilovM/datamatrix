"use client";

import { usePrintStore } from "@/shared/store/printStore";
import { PrintIcon } from "@/shared/ui/icons";
import { usePackGeneration } from "../hooks/usePackGeneration";
import { useAggregationPackStore } from "../store/aggregationPackStore";
import PackInputsList from "./PackInputsList";
import PaginationControls from "./PaginationControls";

export default function PackInputsSection() {
	usePackGeneration();

	const { pages, currentPage } = useAggregationPackStore();
	const { triggerPrint } = usePrintStore();

	const lastGeneratedCode = pages[currentPage]?.uniqueCode;
	const handlePrint = () => {
		triggerPrint();
	};

	return (
		<div className="flex flex-col gap-4 w-1/2 h-full justify-between bg-white rounded-md border border-blue-300 p-4 print:border-none print:gap-0 print:hidden">
			<div className="flex flex-col gap-4 print:hidden">
				<h2 className="text-xl font-semibold print:hidden">Пачки</h2>
				{lastGeneratedCode && (
					<div className="bg-green-100 text-green-800 p-3 rounded-md text-left font-semibold flex justify-between items-center print:hidden">
						<div>
							<span>Уникальный код:</span>
							<br />
							<span className="font-bold">{lastGeneratedCode}</span>
						</div>
						<button
							type="button"
							className="p-2 bg-green-200 hover:bg-green-300 rounded-md"
							onClick={handlePrint}
							aria-label="Print Unique Code"
						>
							<PrintIcon className="size-6" />
						</button>
					</div>
				)}
				<PackInputsList />
			</div>
			<PaginationControls />
		</div>
	);
}
