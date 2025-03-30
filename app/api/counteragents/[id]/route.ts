import { prisma } from "@/shared/lib/prisma";
import type { NextRequest } from "next/server";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const counteragentId = (await params).id;
	await prisma.counteragent.delete({
		where: {
			id: counteragentId,
		},
	});
	return new Response("Success!", {
		status: 200,
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const counteragentId = (await params).id;
	const formData = await req.formData();

	// Extract basic nomenclature fields.
	const name = formData.get("name") as string;
	const inn = formData.get("inn") as string;
	const kpp = formData.get("kpp") as string;

	try {
		await prisma.counteragent.update({
			where: {
				id: counteragentId,
			},
			data: {
				name,
				inn,
				kpp,
			},
		});
		return new Response("Контрагент обновлен!", {
			status: 200,
		});
	} catch (error) {
		return new Response("Произошла ошибка при обновлении!", {
			status: 400,
		});
	}
}
