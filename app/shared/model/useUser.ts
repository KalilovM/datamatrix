"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession, signOut } from "next-auth/react";

export function useUser() {
	const { data: session, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const session = await getSession();
			if (!session?.user) throw new Error("Не авторизован");
			return session.user;
		},
	});

	const logout = async () => {
		await signOut({ callbackUrl: "/auth" });
	};

	return { user: session, isLoading, logout };
}
