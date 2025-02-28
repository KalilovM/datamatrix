import MainLayout from "@/components/MainLayout";
import { getOrders } from "./actions";
import Link from "next/link";
import OrderTableRow from "@/components/orders/OrderTableRow";

export default async function Page() {
  const orders = await getOrders();

  return (
    <MainLayout>
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
    </MainLayout>
  );
}
