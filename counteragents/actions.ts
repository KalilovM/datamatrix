import { prisma } from "@/shared/lib/prisma";
import { cookies } from "next/headers";

export async function getCounteragents() {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	const user = await prisma.session.findUnique({
		where: { token },
		include: {
			user: {
				include: {
					company: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});
	if (!user) return [];
	if (!user.user.company) return [];

	return await prisma.counteragent.findMany({
		where: {
			companyId: user.user.company.id,
		},
	});
}
