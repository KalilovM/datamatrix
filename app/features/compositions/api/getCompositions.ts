import type { Composition } from "@/entities/composition/types";

export async function getCompositions(): Promise<Composition[]> {
	const response = await fetch("/api/compositions");
	if (!response.ok) {
		throw new Error("Произошла ошибка при загрузке составов");
	}

	return response.json();
}
