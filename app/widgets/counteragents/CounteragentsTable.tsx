"use client";

import type { Counteragent } from "@/entities/counteragent/types";
import Link from "next/link";
import CounteragentRow from "./CounteragentRow";

interface CounteragentsTableProps {
	counteragents: Counteragent[];
}

export default function CounteragentsTable({
	counteragents,
}: CounteragentsTableProps) {
	return (
		<div className="table-layout">
			<div className="table-header">
				<p className="table-header-title">Контрагенты</p>
				<Link
					href="/counteragents/create"
					className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
				>
					Создать
				</Link>
			</div>
			<div className="table-rows-layout relative overflow-x-auto">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
						<tr>
							<th scope="col" className="px-6 py-3">
								Наименование контрагента
							</th>
							<th scope="col" className="px-6 py-3">
								ИНН
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{counteragents.length > 0 ? (
							counteragents.map((counteragent) => (
								<CounteragentRow
									key={counteragent.id}
									counteragent={counteragent}
								/>
							))
						) : (
							<tr>
								<td colSpan={3} className="text-center py-4 text-gray-500">
									Нет доступных контрагентов
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
