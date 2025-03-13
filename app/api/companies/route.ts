import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		console.log("SESSION", session);
		if (!session?.user) {
			return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
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
			return NextResponse.json(
				{ message: "Пользователь не найден" },
				{ status: 401 },
			);
		}
		const { role, companyId } = user;

		let companies;
		if (role === "ADMIN") {
			// Admin can see all companies
			companies = await prisma.company.findMany({
				select: {
					id: true,
					name: true,
					subscriptionEnd: true,
					users: {
						select: {
							id: true,
							username: true,
							email: true,
							role: true,
						},
					},
				},
			});
		} else {
			if (!companyId) {
				return NextResponse.json(
					{ error: "Не найдена компания" },
					{ status: 404 },
				);
			}

			// Non-admins can only see their own company
			companies = await prisma.company.findMany({
				where: { id: companyId || "" }, // Avoid returning null values
				select: {
					id: true,
					name: true,
					subscriptionEnd: true,
					users: {
						select: {
							id: true,
							username: true,
							email: true,
							role: true,
						},
					},
				},
			});
		}

		return NextResponse.json(companies, { status: 200 });
	} catch (error) {
		console.error("Ошибка загрузки компаний:", error);
		return NextResponse.json(
			{ error: "Ошибка загрузки компаний" },
			{ status: 500 },
		);
	}
}
