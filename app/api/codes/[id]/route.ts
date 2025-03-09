import { prisma } from "@/shared/lib/prisma";

export default async function GET(
	req: Request,
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
					size: true,
					color: true,
				},
			},
		},
	});
	if (!generatedCode) {
		return new Response(null, { status: 404 });
	}
}
