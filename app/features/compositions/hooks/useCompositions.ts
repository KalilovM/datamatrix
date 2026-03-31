import type { Composition } from "@/entities/composition/types";
import { useQuery } from "@tanstack/react-query";
import { getCompositions } from "../api/getCompositions";

export function useCompositions() {
	return useQuery<Composition[], Error>({
		queryKey: ["compositions"],
		queryFn: getCompositions,
	});
}
