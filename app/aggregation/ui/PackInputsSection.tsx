"use client";

import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { PrintIcon } from "@/shared/ui/icons";
import { usePackGeneration } from "../hooks/usePackGeneration";
import { useAggregationPackStore } from "../store/aggregationPackStore";
import { useAggregationSelectionStore } from "../store/aggregationSelectionStore";
import PackInputsList from "./PackInputsList";
import PaginationControls from "./PaginationControls";

interface Props {
	printTemplate: any; // Replace 'any' with your PrintTemplate type if available
}

export default function PackInputsSection({ printTemplate }: Props) {
	usePackGeneration();

	const { selectedNomenclature } = useAggregationSelectionStore();
	const { pages, currentPage, codes } = useAggregationPackStore();

	const lastGeneratedCode = pages[currentPage]?.uniqueCode;

	return (
		<div className="flex flex-col gap-4 w-1/2 h-full justify-between bg-white rounded-md border border-blue-300 p-4 print:border-none print:h-auto">
			<div className="flex flex-col gap-4">
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
							onClick={() => window.print()}
							aria-label="Print Unique Code"
						>
							<PrintIcon className="size-6" />
						</button>
					</div>
				)}
				<PackInputsList />
				<PrintCodes
					printTemplate={printTemplate}
					selectedNomenclature={selectedNomenclature}
					codes={codes}
				/>
			</div>
			<PaginationControls />
		</div>
	);
}
