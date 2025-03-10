import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	await prisma.order.delete({
		where: { id },
	});
	return NextResponse.json(
		{ message: "success" },
		{
			status: 200,
		},
	);
}
