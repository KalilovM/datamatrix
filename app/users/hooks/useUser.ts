import { useQuery } from "@tanstack/react-query";
import { fetchCompanies, fetchUser } from "../[id]/edit/actions";

export function useUser(id: string) {
	return useQuery({
		queryKey: ["user", id],
		queryFn: () => fetchUser(id),
	});
}

export function useCompanies() {
	return useQuery({
		queryKey: ["companies"],
		queryFn: fetchCompanies,
	});
}
