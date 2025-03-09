import type { Counteragent } from "@/entities/counteragent/model/types";

export async function createCounteragent(data: Counteragent) {
	const response = await fetch("/api/counteragents", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Произошла ошибка при сохранении.");
	}

	return response.json();
}
