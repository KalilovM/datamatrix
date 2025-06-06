import { prisma } from "@/shared/lib/prisma";

export async function getCounteragentById(id: string) {
	return await prisma.counteragent.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			inn: true,
			kpp: true,
		},
	});
}
