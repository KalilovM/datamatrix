import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	console.log(id);
	await prisma.user.delete({
		where: {
			id,
		},
	});
	return NextResponse.json(
		{ message: "success" },
		{
			status: 200,
		},
	);
}
