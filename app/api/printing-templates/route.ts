import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
		}
		const { companyId, role } = session.user;
		if (role === "ADMIN") {
			const printingTemplates = await prisma.printingTemplate.findMany();
			return NextResponse.json(printingTemplates, { status: 200 });
		}
		if (!companyId) {
			return NextResponse.json(
				{ error: "Не найдена компания" },
				{ status: 404 },
			);
		}
		const printingTemplates = await prisma.printingTemplate.findMany({
			where: { companyId },
		});
		return NextResponse.json(printingTemplates, { status: 200 });
	} catch (error: any) {
		console.error("Ошибка при получении шаблонов печати:", error);
		return NextResponse.json(
			{ error: "Ошибка при получении шаблонов печати" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		// Parse the JSON payload
		const data = await request.json();
		const { qrPosition, textFields } = data;

		// Ensure the user is authenticated and has an associated company
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
		}

		const { companyId, role } = session.user;
		if (!companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}

		// Validate payload
		if (!qrPosition || (qrPosition !== "left" && qrPosition !== "right")) {
			return NextResponse.json(
				{ error: "Некорректная позиция QR кода" },
				{ status: 400 },
			);
		}
		if (!Array.isArray(textFields) || textFields.length === 0) {
			return NextResponse.json(
				{ error: "Не выбраны текстовые поля" },
				{ status: 400 },
			);
		}

		// Map the frontend values to your Prisma enums.
		// Prisma enums for QR position and template fields are assumed to be uppercase.
		const qrPos = qrPosition.toUpperCase(); // "left" => "LEFT", "right" => "RIGHT"

		// Mapping for text fields from frontend keys to Prisma enum values.
		const fieldTypeMapping: {
			[key: string]: "NAME" | "MODEL_ARTICLE" | "COLOR" | "SIZE";
		} = {
			name: "NAME",
			modelArticle: "MODEL_ARTICLE",
			color: "COLOR",
			size: "SIZE",
		};

		// Create the printing template with nested field creation.
		const template = await prisma.printingTemplate.create({
			data: {
				name: "Новый шаблон", // You could extend this to accept a custom name.
				qrPosition: qrPos,
				company: {
					connect: { id: companyId },
				},
				fields: {
					create: textFields.map((field: string, index: number) => ({
						order: index + 1,
						fieldType: fieldTypeMapping[field],
					})),
				},
			},
		});

		return NextResponse.json(
			{ message: "Шаблон успешно создан", template },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error("Ошибка сохранения шаблона:", error);
		return NextResponse.json(
			{ error: "Ошибка при сохранении шаблона" },
			{ status: 500 },
		);
	}
}
