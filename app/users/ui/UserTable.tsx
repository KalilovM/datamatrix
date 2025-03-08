"use client";

import Link from "next/link";
import type { User } from "../model/schema";
import UserRow from "./UserRow";

interface UsersTableProps {
	users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
	return (
		<div className="table-layout">
			{/* Table Header */}
			<div className="table-header">
				<p className="table-header-title">Пользователи</p>
				<Link
					className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer"
					href="/users/create"
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
								Имя пользователя
							</th>
							<th scope="col" className="px-6 py-3">
								Роль
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{users.length > 0 ? (
							users.map((user) => <UserRow key={user.id} user={user} />)
						) : (
							<tr>
								<td colSpan={4} className="text-center py-4 text-gray-500">
									Нет доступных пользователей
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
