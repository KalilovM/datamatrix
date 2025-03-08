import { prisma } from "@/shared/lib/prisma";
// import { parseBarcode } from "gs1-barcode-parser-mod";

export async function POST(req: Request) {
	const { code } = await req.json();

	// const parsed = parseBarcode(code);
	// console.log("FORMAT", parsed);

	// const formattedCode = parsed.parsedCodeItems
	//   .map((item) => item.ai + item.data) // Concatenate AI and its value
	//   .join(""); // Join them to form the complete string

	// console.log("FORMATTED CODE:", formattedCode);
	//
	const formattedCode = code.replace(/[^a-zA-Z0-9+=_]/g, "");

	const exists = await prisma.code.findFirst({
		where: { formattedValue: formattedCode, used: false },
	});

	if (!exists) {
		return new Response(JSON.stringify({ exists: false }), { status: 404 });
	}

	return new Response(JSON.stringify({ exists: true }), { status: 200 });
}
