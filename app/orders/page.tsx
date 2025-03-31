"use client";

import { useOrders } from "@/features/orders/hooks/useOrders";
import OrderTableRow from "@/orders/ui/OrderTableRow";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import Link from "next/link";
import { useEffect } from "react";
import { useOrderNomenclatureStore } from "./stores/useOrderNomenclatureStore";
import { useOrderStore } from "./stores/useOrderStore";

const Page = () => {
	const { data: orders, error, isLoading } = useOrders();
	const { reset } = useOrderStore();
	const { resetRows } = useOrderNomenclatureStore();

	useEffect(() => {
		reset();
		resetRows();
	}, []);

	if (isLoading) {
		return <Layout>Загрузка...</Layout>;
	}
	if (error) {
		return <Layout>Произошла ошибка: {error.message}</Layout>;
	}

	return (
		<Layout>
			<div className="table-layout">
				<div className="table-header">
					<p className="table-header-title">Заказы</p>
					<Link
						className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
						href="/orders/create"
					>
						Создать
					</Link>
				</div>
				<div className="table-rows-layout relative overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
							<tr>
								<th scope="col" className="px-6 py-3">
									Наименование заказа
								</th>
								<th scope="col" className="px-6 py-3">
									Дата заказа
								</th>
								<th scope="col" className="px-6 py-3">
									Контрагент
								</th>
								<th scope="col" className="px-6 py-3">
									Заказано
								</th>
								<th scope="col" className="px-6 py-3">
									Отгружено
								</th>
								<th scope="col" className="px-6 py-3 text-right">
									Действия
								</th>
							</tr>
						</thead>
						<tbody>
							{orders.length > 0 ? (
								orders.map((order) => (
									<OrderTableRow key={order.id} order={order} />
								))
							) : (
								<tr>
									<td colSpan={3} className="text-center py-4 text-gray-500">
										Нет доступных заказов
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_USER", "COMPANY_ADMIN"],
});
