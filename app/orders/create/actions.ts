import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";

export async function getCounteragentOptions() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}
	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		select: {
			role: true,
			companyId: true,
		},
	});
	if (!user) {
		return [];
	}
	if (!user?.companyId) {
		return [];
	}

	return await prisma.counteragent.findMany({
		where: {
			companyId: user.companyId,
		},
		select: {
			id: true,
			name: true,
		},
	});
}
