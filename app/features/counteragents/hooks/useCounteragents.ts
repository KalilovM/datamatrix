import type { Counteragent } from "@/entities/counteragent/types";
import { useQuery } from "@tanstack/react-query";
import { getCounteragents } from "../api/getCounteragents";

export function useCounteragents() {
	return useQuery<Counteragent[], Error>({
		queryKey: ["counteragents"],
		queryFn: getCounteragents,
	});
}
