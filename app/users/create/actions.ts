"use server";

import { prisma } from "@/shared/lib/prisma";
import { NewUserSchema } from "./schema";
import type { FormData } from "./types";

export async function fetchCompanies() {
	return await prisma.company.findMany({
		select: { id: true, name: true },
	});
}

export async function createUser(data: FormData) {
	const parsedData = NewUserSchema.safeParse(data);
	if (!parsedData.success) {
		throw new Error("Неверные данные");
	}

	await prisma.user.create({
		data: {
			email: parsedData.data.email,
			username: parsedData.data.username,
			password: parsedData.data.password,
			role: parsedData.data.role,
			company: parsedData.data.companyId
				? { connect: { id: parsedData.data.companyId } }
				: undefined,
		},
	});
}
