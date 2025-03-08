"use client";

import Link from "next/link";
import type { Nomenclature } from "../model/types";
import NomenclatureRow from "./NomenclatureRow";

interface Props {
	nomenclatures: Nomenclature[];
}

export default function NomenclatureTable({ nomenclatures }: Props) {
	return (
		<div className="table-layout">
			{/* Table Header */}
			<div className="table-header">
				<p className="table-header-title">Номенклатуры</p>
				<Link
					href="/nomenclature/create"
					className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer"
				>
					Создать
				</Link>
			</div>

			{/* Table Rows */}
			<div className="table-rows-layout relative overflow-x-auto">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
						<tr>
							<th scope="col" className="px-6 py-3">
								Название
							</th>
							<th scope="col" className="px-6 py-3">
								Неиспользованные коды
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{nomenclatures.length > 0 ? (
							nomenclatures.map((nomenclature) => (
								<NomenclatureRow
									key={nomenclature.id}
									nomenclature={nomenclature}
								/>
							))
						) : (
							<tr>
								<td colSpan={3} className="text-center py-4 text-gray-500">
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
