"use client";

import type { Composition } from "@/entities/composition/types";
import Link from "next/link";
import CompositionRow from "./CompositionRow";

interface CompositionsTableProps {
	compositions: Composition[];
}

export default function CompositionsTable({
	compositions,
}: CompositionsTableProps) {
	return (
		<div className="table-layout">
			<div className="table-header">
				<p className="table-header-title">Составы</p>
				<Link
					href="/compositions/create"
					className="rounded-md bg-blue-500 px-2.5 py-1.5 text-white"
				>
					Создать
				</Link>
			</div>
			<div className="relative overflow-x-auto table-rows-layout">
				<table className="w-full text-left text-sm text-gray-500">
					<thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-700">
						<tr>
							<th scope="col" className="px-6 py-3">
								Название
							</th>
							<th scope="col" className="px-6 py-3">
								Дата создания
							</th>
							<th scope="col" className="px-6 py-3">
								Дата обновления
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{compositions.length > 0 ? (
							compositions.map((composition) => (
								<CompositionRow key={composition.id} composition={composition} />
							))
						) : (
							<tr>
								<td colSpan={4} className="py-4 text-center text-gray-500">
									Нет доступных составов
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
