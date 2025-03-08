"use server";

import { prisma } from "@/shared/lib/prisma";
import { NewCompanySchema } from "./schema";
import type { FormData } from "./types";

export async function fetchUsers() {
	return await prisma.user.findMany({
		select: { id: true, username: true },
	});
}

export async function createNewCompany(data: FormData) {
	const parsedData = NewCompanySchema.safeParse(data);
	if (!parsedData.success) {
		throw new Error("Неверные данные");
	}

	await prisma.company.create({
		data: {
			name: parsedData.data.name,
			token: parsedData.data.token,
			subscriptionEnd: new Date(parsedData.data.subscriptionEnd),
			users: {
				connect: parsedData.data.users.map((id) => ({ id })),
			},
		},
	});
}
