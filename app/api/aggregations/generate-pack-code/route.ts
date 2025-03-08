import { prisma } from "@/shared/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
	const { packCodes, nomenclatureId, configurationId } = await req.json();
	const formattedValue = packCodes.map((code) =>
		code.replace(/[^a-zA-Z0-9+=_]/g, ""),
	);
	const codes = await prisma.code.findMany({
		where: {
			formattedValue: { in: formattedValue },
			used: false,
		},
	});
	if (codes.length !== packCodes.length) {
		return new Response(JSON.stringify({ error: "Коды уже использованы" }), {
			status: 404,
		});
	}
	const uniqueCode = uuidv4();
	await prisma.generatedCodePack.create({
		data: {
			value: uniqueCode,
			nomenclatureId,
			configurationId,
			codes: {
				connect: codes.map((code) => ({ id: code.id })),
			},
		},
	});
	console.log("codePack", codepack);
	await prisma.code.updateMany({
		where: { value: { in: packCodes } },
		data: { used: true },
	});
	return new Response(JSON.stringify({ value: uniqueCode }), { status: 200 });
}
