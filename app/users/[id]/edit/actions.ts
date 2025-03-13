"use server";

import { prisma } from "@/shared/lib/prisma";
import type { FormData } from "./types";

export async function fetchUser(id: string) {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			companyId: true,
		},
	});
}

export async function fetchCompanies() {
	return await prisma.company.findMany({
		select: { id: true, name: true },
	});
}

export async function updateUser(id: string, data: FormData) {
	console.log(data);
	await prisma.user.update({
		where: { id },
		data: {
			email: data.email,
			username: data.username,
			role: data.role,
			companyId: data.companyId.value || null,
		},
	});
}
