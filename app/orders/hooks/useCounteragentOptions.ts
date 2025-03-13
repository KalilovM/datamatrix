import { useQuery } from "@tanstack/react-query";
import { getCounteragentOptions } from "../create/actions";

export default function useCounteragentOptions() {
	return useQuery({
		queryKey: ["counteragentOptions"],
		queryFn: getCounteragentOptions,
	});
}
