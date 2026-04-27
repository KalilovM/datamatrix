import type { Filters, IAggregatedCode } from "@/aggregation-codes/definitions";
import { useEffect, useState } from "react";
import { CloseIcon, FilterIcon, SearchIcon } from "../Icons";
import AggregationCodesRow from "./AggregationCodesRow";

interface Props {
	aggregatedCodes: IAggregatedCode[];
	currentPage: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	filters: Filters;
	onApply: (filters: Filters) => void;
	onPageChange: (page: number) => void;
}

export default function TableContent({
	aggregatedCodes,
	currentPage,
	pageSize,
	totalCount,
	totalPages,
	filters,
	onApply,
	onPageChange,
}: Props) {
	const [tempFilters, setTempFilters] = useState(filters);
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		setTempFilters(filters); // keep in sync when global filters change externally
	}, [filters]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const clearField = (field: keyof Filters) => {
		setTempFilters((prev) => ({ ...prev, [field]: "" }));
	};

	const hasRows = aggregatedCodes.length > 0;
	const startItem = hasRows ? (currentPage - 1) * pageSize + 1 : 0;
	const endItem = hasRows ? startItem + aggregatedCodes.length - 1 : 0;

	return (
		<div className="table-layout print:border-none print:rounded-none print:hidden">
			{/* Table Header */}
			<div className="table-header print:hidden">
				<p className="table-header-title">Агрегированные коды</p>
				<div className="flex gap-2">
					<div className="relative">
						<button
							className="bg-white p-2 text-black rounded-md cursor-pointer shadow-md hover:shadow-lg border border-gray-400"
							onClick={() => setShowFilters(!showFilters)}
						>
							<span>
								<FilterIcon className="size-5" strokeWidth="2" stroke="black" />
							</span>
						</button>
						{showFilters && (
							<div className="px-2 py-3 bg-white rounded-md shadow-md border-gray-400 border absolute top-12 right-0 z-50 w-64 space-y-2">
								{[
									{ key: "name", label: "Название" },
									{ key: "generatedCode", label: "Код" },
									{ key: "modelArticle", label: "Модель" },
									{ key: "color", label: "Цвет" },
								].map(({ key, label }) => (
									<div className="relative" key={key}>
										<input
											className="border px-3 py-2 rounded w-full"
											name={key}
											value={tempFilters[key as keyof Filters] || ""}
											onChange={handleChange}
											placeholder={label}
										/>
										{tempFilters[key as keyof Filters] && (
											<button
												type="button"
												className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
												onClick={() => clearField(key as keyof Filters)}
											>
												<CloseIcon />
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => {
										onApply(tempFilters);
										setShowFilters(false);
									}}
									className="bg-blue-500 text-white px-3 py-1 rounded w-full"
								>
									Применить
								</button>
							</div>
						)}
					</div>

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

			{/* Table Columns */}
			<AggregationCodesRow aggregatedCodes={aggregatedCodes} />

			{totalPages > 1 && (
				<div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-gray-500">
						{`Показано ${startItem}-${endItem} из ${totalCount}`}
					</p>
					<div className="flex items-center gap-2">
						<button
							type="button"
							disabled={currentPage === 1}
							onClick={() => onPageChange(Math.max(1, currentPage - 1))}
							className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Назад
						</button>
						<span className="text-sm text-gray-600">
							{`Страница ${currentPage} из ${totalPages}`}
						</span>
						<button
							type="button"
							disabled={currentPage === totalPages}
							onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
							className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Вперед
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
