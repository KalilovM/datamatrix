import { prisma } from "@/shared/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	await prisma.company.delete({
		where: { id },
	});
	return NextResponse.json(
		{ message: "success" },
		{
			status: 200,
		},
	);
}
