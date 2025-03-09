import type { Counteragent } from "@/entities/counteragent/types";

export async function getCounteragents(): Promise<Counteragent[]> {
	const response = await fetch("/api/counteragents");
	if (!response.ok) {
		throw new Error("Произошла ошибка при загрузке контрагентов");
	}
	return response.json();
}
