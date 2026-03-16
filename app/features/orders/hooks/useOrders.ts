import type { IOrder } from "@/orders/definitions";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/getOrders";

export function useOrders() {
	return useQuery<IOrder[], Error>({
		queryKey: ["orders"],
		queryFn: getOrders,
	});
}
