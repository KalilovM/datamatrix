"use client";

import { useMutation } from "@tanstack/react-query";

const generatePackCode = async (packData: {
	packCodes: string[];
	configurationId: string;
	nomenclatureId: string;
}) => {
	const response = await fetch("/api/aggregations/generate-pack-code", {
		method: "POST",
		body: JSON.stringify(packData),
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		throw new Error("Ошибка при генерации кода");
	}

	return response.json();
};

export const useGeneratePackCode = () => {
	return useMutation({
		mutationFn: generatePackCode,
	});
};
