import { prisma } from "@/shared/lib/prisma";

export async function getCompositionById(id: string) {
	return await prisma.composition.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
		},
	});
}
