import { prisma } from "@/shared/lib/prisma";
import { cookies } from "next/headers";

export async function getCounteragentOptions() {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	const user = await prisma.session.findUnique({
		where: { token },
		include: {
			user: {
				include: {
					company: { select: { id: true } },
				},
			},
		},
	});

	if (!user || !user.user.company) return [];

	const companyId = user.user.company.id;

	return await prisma.counteragent.findMany({
		where: {
			companyId: companyId,
		},
		select: {
			id: true,
			name: true,
		},
	});
}
