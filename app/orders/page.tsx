import OrderTableRow from "@/components/orders/OrderTableRow";
import Layout from "@/shared/ui/Layout";
import Link from "next/link";
import { getOrders } from "./actions";

export default async function Page() {
	const orders = await getOrders();

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
				<div className="table-rows-layout">
					{orders.map((order) => (
						<OrderTableRow key={order.id} order={order} />
					))}
				</div>
			</div>
		</Layout>
	);
}
