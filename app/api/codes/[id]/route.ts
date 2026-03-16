import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const generatedCode = await prisma.generatedCodePack.findUnique({
		where: { id },
		select: {
			codes: {
				select: {
					value: true,
				},
			},
			nomenclature: {
				select: {
					name: true,
					modelArticle: true,
					color: true,
				},
			},
		},
	});
	if (!generatedCode) {
		return new Response(null, { status: 404 });
	}

	return NextResponse.json(generatedCode);
}
