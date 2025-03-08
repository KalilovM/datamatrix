"use client";

import { useMutation } from "@tanstack/react-query";

const checkCodeInDB = async (code: string): Promise<boolean> => {
	const response = await fetch("/api/codes/validate-code", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code }),
	});

	const data = await response.json();
	return data.exists;
};

export const useCheckCode = () => {
	return useMutation({
		mutationFn: checkCodeInDB,
	});
};
