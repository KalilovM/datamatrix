import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
		}
		const user = await prisma.user.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				role: true,
				companyId: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ message: "Пользователь не найден" },
				{ status: 401 },
			);
		}

		if (!user?.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}
		const { role, companyId } = user;
		if (role === "ADMIN") {
			const printingTemplates = await prisma.printingTemplate.findMany({
				orderBy: [{ type: "asc" }, { createdAt: "desc" }],
			});
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
			orderBy: { type: "asc" },
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
		const { qrPosition, textFields, qrType, canvasSize, name, type } = data;
		const { width, height } = canvasSize;

		// Convert canvasSize dimensions from strings (e.g., "58mm") to numbers
		const widthInt = Number.parseInt(width.replace("mm", "").trim(), 10);
		const heightInt = Number.parseInt(height.replace("mm", "").trim(), 10);

		// Ensure the user is authenticated and has an associated company
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
		}
		const user = await prisma.user.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				companyId: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ message: "Пользователь не найден" },
				{ status: 401 },
			);
		}

		if (!user?.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}
		const { companyId } = user;
		if (!companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}

		// Validate payload
		if (!qrPosition || !["left", "right", "center"].includes(qrPosition)) {
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
		const qrPos = qrPosition.toUpperCase(); // "left" => "LEFT", "right" => "RIGHT", "center" => "CENTER"

		// Mapping for the printing template type
		const typeMapping: { [key: string]: "AGGREGATION" | "NOMENCLATURE" } = {
			aggregation: "AGGREGATION",
			nomenclature: "NOMENCLATURE",
		};
		const templateType = typeMapping[type];
		if (!templateType) {
			return NextResponse.json(
				{ error: "Некорректный тип шаблона" },
				{ status: 400 },
			);
		}

		// Mapping for text fields from frontend keys to Prisma enum values.
		const fieldTypeMapping: {
			[key: string]: "NAME" | "MODEL_ARTICLE" | "COLOR" | "SIZE";
		} = {
			name: "NAME",
			modelArticle: "MODEL_ARTICLE",
			color: "COLOR",
			size: "SIZE",
		};

		// Filter out text fields where the field id is empty.
		const filteredFields = textFields.filter(
			(field: any) => field.field && field.field.trim() !== "",
		);
		// Create the printing template with nested field creation.
		const template = await prisma.printingTemplate.create({
			data: {
				name: name || "Новый шаблон",
				type: templateType,
				qrPosition: qrPos,
				width: widthInt,
				height: heightInt,
				qrType: qrType.toUpperCase(),
				company: {
					connect: { id: companyId },
				},
				fields: {
					create: filteredFields.map((field: any, index: number) => ({
						order: index + 1,
						fieldType: fieldTypeMapping[field.field],
						isBold: field.bold,
						fontSize: field.size,
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
