"use server";

import { prisma } from "@/shared/lib/prisma";
import { EditUserSchema } from "./schema";
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
	const parsedData = EditUserSchema.safeParse(data);
	if (!parsedData.success) {
		throw new Error("Неверные данные");
	}

	await prisma.user.update({
		where: { id },
		data: {
			email: parsedData.data.email,
			username: parsedData.data.username,
			role: parsedData.data.role,
			companyId: parsedData.data.companyId || null,
		},
	});
}
