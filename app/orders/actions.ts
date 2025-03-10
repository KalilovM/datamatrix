import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";

export async function getOrders() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}
	const user = session.user;
	if (!user?.companyId) {
		return [];
	}

	return await prisma.order.findMany({
		where: { companyId: user.companyId },
		select: {
			id: true,
			createdAt: true,
			counteragent: {
				select: {
					name: true,
				},
			},
		},
	});
}
