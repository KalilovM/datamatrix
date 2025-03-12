import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const printTemplate = await prisma.printingTemplate.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			type: true,
			qrType: true,
			qrPosition: true,
			width: true,
			height: true,
			isDefault: true,
			fields: {
				select: {
					id: true,
					fieldType: true,
					isBold: true,
					fontSize: true,
					order: true,
				},
			},
		},
	});
	return NextResponse.json(printTemplate, { status: 200 });
}
