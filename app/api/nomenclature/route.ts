import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { processCodeFile } from "./helpers";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
		}
		const user = session.user;
		if (!user?.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании", user: user },
				{ status: 404 },
			);
		}

		const nomenclatureOptions = await prisma.nomenclature.findMany({
			where: { companyId: user.companyId },
			select: {
				id: true,
				name: true,
				configurations: {
					select: {
						id: true,
						nomenclatureId: true,
						pieceInPack: true,
						packInPallet: true,
					},
				},
			},
		});

		return NextResponse.json(nomenclatureOptions);
	} catch (error) {
		console.error("Ошибка загрузки номенклатуры:", error);
		return NextResponse.json(
			{ error: "Ошибка загрузки данных" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const formData = await request.formData();
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
	}
	const user = session.user;
	if (!user?.companyId) {
		return NextResponse.json(
			{ error: "Требуется наличие компании" },
			{ status: 404 },
		);
	}

	// Extract basic nomenclature fields.
	const name = formData.get("name") as string;
	const modelArticle = formData.get("modelArticle") as string;
	const color = formData.get("color") as string;
	const size = formData.get("size") as string;
	if (!name) {
		return NextResponse.json(
			{ error: "Наименование обязательно" },
			{ status: 400 },
		);
	}

	// Parse configurations JSON.
	const configurationsJson = formData.get("configurations") as string;
	let configurations: { peaceInPack: number; packInPallet: number }[] = [];
	try {
		configurations = JSON.parse(configurationsJson);
	} catch (err) {
		return NextResponse.json(
			{ error: "Неверный формат JSON для конфигураций" },
			{ status: 400 },
		);
	}

	// Parse codes from CSV.
	// Expecting the "codes" field to be a JSON string representing an array of objects:
	// [{ fileName: string, content: string }, ... ]
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

	// Map configurations to the shape expected by Prisma.
	// Note: our form sends "peaceInPack", but our model expects "pieceInPack".
	const configCreateData = configurations.map((cfg) => ({
		pieceInPack: cfg.peaceInPack,
		packInPallet: cfg.packInPallet,
	}));

	try {
		// Wrap creation in a transaction. If any error occurs, the transaction will roll back.
		const newNomenclature = await prisma.$transaction(async (tx) => {
			return await tx.nomenclature.create({
				data: {
					name,
					modelArticle,
					color,
					size,
					companyId: user.companyId,
					configurations: { create: configCreateData },
					codePacks: { create: codePackCreateData },
				},
				include: {
					configurations: true,
					codePacks: {
						include: { codes: true },
					},
				},
			});
		});

		return NextResponse.json(newNomenclature);
	} catch (error) {
		console.error("Ошибка при создании номенклатуры:", error);
		return NextResponse.json(
			{ error: "Не удалось создать номенклатуру" },
			{ status: 500 },
		);
	}
}
