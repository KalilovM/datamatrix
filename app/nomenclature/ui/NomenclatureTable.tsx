"use client";

import { CloseIcon, FilterIcon } from "@/shared/ui/icons";
import Link from "next/link";
import { useState } from "react";
import type { Nomenclature } from "../model/types";
import NomenclatureRow from "./NomenclatureRow";

interface Filters {
	name?: string;
	modelArticle?: string;
	color?: string;
	gtin?: string;
}

interface Props {
	nomenclatures: Nomenclature[];
	filters: Filters;
	handleFiltersChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onApply: () => void;
}

export default function NomenclatureTable({
	nomenclatures,
	filters,
	handleFiltersChange,
	onApply,
}: Props) {
	const [showFilters, setShowFilters] = useState(false);
	return (
		<div className="table-layout">
			{/* Table Header */}
			<div className="table-header">
				<p className="table-header-title">Номенклатуры</p>
				<div className="gap-4 flex flex-row items-center justify-between">
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowFilters(!showFilters)}
							className="bg-white p-2 text-black rounded-md cursor-pointer shadow-md hover:shadow-lg border border-gray-400"
						>
							<FilterIcon />
						</button>
						{showFilters && (
							<div className="px-2 py-3 bg-white rounded-md shadow-md border-gray-400 border absolute top-12 right-0 z-50 w-64 space-y-2">
								<div className="relative">
									<input
										className="border px-3 py-2 rounded w-full"
										name="name"
										value={filters.name}
										onChange={handleFiltersChange}
										placeholder="Название"
									/>
									{filters.name && (
										<button
											type="button"
											className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
											onClick={() =>
												handleFiltersChange({
													target: { name: "name", value: "" },
												} as React.ChangeEvent<HTMLInputElement>)
											}
										>
											<CloseIcon />
										</button>
									)}
								</div>
								<div className="relative">
									<input
										className="border px-3 py-2 rounded w-full"
										name="gtin"
										value={filters.gtin}
										onChange={handleFiltersChange}
										placeholder="GTIN"
									/>
									{filters.gtin && (
										<button
											type="button"
											className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
											onClick={() =>
												handleFiltersChange({
													target: { name: "gtin", value: "" },
												} as React.ChangeEvent<HTMLInputElement>)
											}
										>
											<CloseIcon />
										</button>
									)}
								</div>

								<div className="relative">
									<input
										className="border px-3 py-2 rounded w-full"
										name="modelArticle"
										value={filters.modelArticle}
										onChange={handleFiltersChange}
										placeholder="Модель"
									/>
									{filters.modelArticle && (
										<button
											type="button"
											className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
											onClick={() =>
												handleFiltersChange({
													target: { name: "modelArticle", value: "" },
												} as React.ChangeEvent<HTMLInputElement>)
											}
										>
											<CloseIcon />
										</button>
									)}
								</div>

								<div className="relative">
									<input
										className="border px-3 py-2 rounded w-full"
										name="color"
										value={filters.color}
										onChange={handleFiltersChange}
										placeholder="Цвет"
									/>
									{filters.color && (
										<button
											type="button"
											className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
											onClick={() =>
												handleFiltersChange({
													target: { name: "color", value: "" },
												} as React.ChangeEvent<HTMLInputElement>)
											}
										>
											<CloseIcon />
										</button>
									)}
								</div>

								<button
									type="button"
									onClick={() => {
										onApply();
										setShowFilters(false);
									}}
									className="bg-blue-500 text-white px-3 py-1 rounded w-full"
								>
									Применить
								</button>
							</div>
						)}
					</div>
					<Link
						href="/nomenclature/create"
						className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer"
					>
						Создать
					</Link>
				</div>
			</div>

			{/* Table Rows */}
			<div className="table-rows-layout relative w-full h-full">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 w-full">
						<tr>
							<th scope="col" className="px-6 py-3">
								Название
							</th>
							<th scope="col" className="px-6 py-3">
								GTIN
							</th>
							<th scope="col" className="px-6 py-3">
								Модель
							</th>
							<th scope="col" className="px-6 py-3">
								Цвет
							</th>
							<th scope="col" className="px-6 py-3">
								Неиспользованные коды
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Действия
							</th>
						</tr>
					</thead>
					<tbody className="w-full">
						{nomenclatures.length > 0 ? (
							nomenclatures.map((nomenclature) => (
								<NomenclatureRow
									key={nomenclature.id}
									nomenclature={nomenclature}
								/>
							))
						) : (
							<tr>
								<td colSpan={6} className="text-center py-4 text-gray-500">
									Нет доступных номенклатур
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
