import { NextResponse } from "next/server";
import { processCodeFile } from "../helpers";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
	const formData = await request.formData();
	const nomenclatureId = formData.get("id") as string;
	const codesFieldRaw = formData.get("codes");
	let codes: { fileName: string; content: string }[] = [];
	if (typeof codesFieldRaw === "string") {
		try {
			codes = JSON.parse(codesFieldRaw);
		} catch (err) {
			return NextResponse.json(
				{ error: "Неверный формат данных для кодов" },
				{ status: 400 },
			);
		}
	} else {
		return NextResponse.json(
			{ error: "Коды должны быть загружены в формате CSV" },
			{ status: 400 },
		);
	}

	// Process each code file using the helper functions.
	const codePackCreateData: any[] = [];
	for (const fileObj of codes) {
		try {
			const codePackData = await processCodeFile(fileObj);
			codePackCreateData.push(codePackData);
		} catch (err: any) {
			return NextResponse.json({ error: err.message }, { status: 400 });
		}
	}
	// add codePackCreateData to the existing nomenclature
	const updatedNomenclature = await prisma.nomenclature.update({
		where: { id: nomenclatureId },
		data: {
			codePacks: { create: codePackCreateData },
		},
	});

	return NextResponse.json(updatedNomenclature);
}
