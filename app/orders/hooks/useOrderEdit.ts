import { useQuery } from "@tanstack/react-query";
import { getEditOrder } from "../create/actions";

export default function useOrderEdit(orderId: string) {
	return useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getEditOrder(orderId),
	});
}
