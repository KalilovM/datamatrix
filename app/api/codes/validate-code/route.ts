import { prisma } from "@/shared/lib/prisma";

export async function POST(req: Request) {
	const { code } = await req.json();

	const formattedCode = code.replace(/[^a-zA-Z0-9+=_]/g, "").replace(/\s/g, "");
	console.log(formattedCode, "FormattedCode");

	const exists = await prisma.code.findFirst({
		where: { formattedValue: formattedCode, used: false },
	});

	if (!exists) {
		return new Response(JSON.stringify({ exists: false }), { status: 404 });
	}

	return new Response(JSON.stringify({ exists: true }), { status: 200 });
}
