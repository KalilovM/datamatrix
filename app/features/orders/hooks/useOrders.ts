import type { Order } from "@/entities/orders/types";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/getOrders";

export function useOrders() {
	return useQuery<Order[], Error>({
		queryKey: ["orders"],
		queryFn: getOrders,
	});
}
