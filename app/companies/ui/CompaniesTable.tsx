"use client";

import type { Company } from "@prisma/client";
import Link from "next/link";
import CompanyRow from "./CompanyRow";

interface CompaniesTableProps {
	companies: Company[];
}

export default function CompaniesTable({ companies }: CompaniesTableProps) {
	return (
		<div className="table-layout">
			{/* Table Header */}
			<div className="table-header">
				<p className="table-header-title">Компании</p>
				<Link
					href="/companies/create"
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
								Название компании
							</th>
							<th scope="col" className="px-6 py-3">
								Дата подписки
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{companies.length > 0 ? (
							companies.map((company) => (
								<CompanyRow key={company.id} company={company} />
							))
						) : (
							<tr>
								<td colSpan={3} className="text-center py-4 text-gray-500">
									Нет доступных компаний
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
