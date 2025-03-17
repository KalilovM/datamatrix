"use server";

import { prisma } from "@/shared/lib/prisma";
import type { FormData } from "./types";

export async function fetchCompanies() {
	return await prisma.company.findMany({
		select: { id: true, name: true },
	});
}

export async function createUser(data: FormData) {
	const existingUsername = await prisma.user.findUnique({
		where: { username: data.username },
	});

	if (existingUsername) {
		throw new Error("Имя пользователя уже занято.");
	}

	await prisma.user.create({
		data: {
			email: data.email,
			username: data.username,
			password: data.password,
			role: data.role,
			company: data.companyId
				? { connect: { id: data.companyId.value } }
				: undefined,
		},
	});
}
