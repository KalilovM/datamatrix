"use server";

import type { IAggregatedCode } from "@/app/aggregation-codes/defenitions";
import AggregationCodesRow from "./AggregationCodesRow";
import { FilterIcon, SearchIcon } from "../Icons";
import type { PrintingTemplate } from "@prisma/client";

interface ITableContentProps {
	aggregatedCodes: IAggregatedCode[];
	defaultTemplate: PrintingTemplate | null | never[];
}

export default async function TableContent({
	aggregatedCodes,
	defaultTemplate,
}: ITableContentProps) {
	return (
		<div className="table-layout print:border-none print:rounded-none">
			{/* Table Header */}
			<div className="table-header print:hidden">
				<p className="table-header-title">Агрегированные коды</p>
				<div className="flex gap-2">
					<button className="bg-neutral-100 text-white p-2 rounded-md shadow-sm">
						<span>
							<FilterIcon className="size-5" strokeWidth="2" stroke="black" />
						</span>
					</button>

					<div className="relative">
						<div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
							<SearchIcon className="w-5 h-5 text-gray-400" />
						</div>
						<input
							type="search"
							id="default-search"
							className="block w-full min-w-64 p-2 pe-10 text-sm text-gray-900 border border-neutral-100 rounded-lg bg-neutral-50 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Поиск"
							required
						/>
					</div>
				</div>
			</div>

			{/* Filters (Hidden by Default - Toggle Logic Required) */}
			<div className="table-filters hidden">
				<select className="border rounded-md px-3 py-1.5">
					<option value="">Все</option>
					<option value="Pack">Pack</option>
					<option value="Pallet">Pallet</option>
				</select>
				<input type="date" className="border rounded-md px-3 py-1.5" />
				<input
					type="text"
					placeholder="Конфигурация"
					className="border rounded-md px-3 py-1.5"
				/>
			</div>

			{/* Table Columns */}
			<AggregationCodesRow
				aggregatedCodes={aggregatedCodes}
				defaultTemplate={defaultTemplate}
			/>
		</div>
	);
}
