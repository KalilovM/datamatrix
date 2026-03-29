import { authOptions } from "@/shared/lib/auth";
import {
	isNomenclatureDetailsLayout,
	toPrismaTemplateFieldType,
	toPrismaTemplateLayout,
} from "@/shared/lib/printingTemplate";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type TemplateFieldInput = {
	field: string;
	bold: boolean;
	size: number;
};

type PrintingTemplateListItem = Awaited<
	ReturnType<typeof prisma.printingTemplate.findMany>
>[number];

const normalizeDefaultTemplates = async (
	templates: PrintingTemplateListItem[],
) => {
	const seenDefaultGroups = new Set<string>();
	const duplicateDefaultIds: string[] = [];

	const normalizedTemplates = templates.map((template) => {
		if (!template.isDefault) {
			return template;
		}

		const groupKey = `${template.companyId}:${template.type}`;
		if (seenDefaultGroups.has(groupKey)) {
			duplicateDefaultIds.push(template.id);
			return {
				...template,
				isDefault: false,
			};
		}

		seenDefaultGroups.add(groupKey);
		return template;
	});

	if (duplicateDefaultIds.length > 0) {
		await prisma.printingTemplate.updateMany({
			where: {
				id: {
					in: duplicateDefaultIds,
				},
			},
			data: {
				isDefault: false,
			},
		});
	}

	return normalizedTemplates;
};

export async function GET() {
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

		if (!user.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}
		const { role, companyId } = user;
		if (role === "ADMIN") {
			const printingTemplates = await prisma.printingTemplate.findMany({
				orderBy: [{ type: "asc" }, { updatedAt: "desc" }, { createdAt: "desc" }],
			});
			return NextResponse.json(
				await normalizeDefaultTemplates(printingTemplates),
				{ status: 200 },
			);
		}

		const printingTemplates = await prisma.printingTemplate.findMany({
			where: { companyId },
			orderBy: [{ type: "asc" }, { updatedAt: "desc" }, { createdAt: "desc" }],
		});
		return NextResponse.json(await normalizeDefaultTemplates(printingTemplates), {
			status: 200,
		});
	} catch (error: unknown) {
		console.error("Ошибка при получении шаблонов печати:", error);
		return NextResponse.json(
			{ error: "Ошибка при получении шаблонов печати" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const {
			qrPosition,
			textFields = [],
			qrType,
			canvasSize,
			name,
			type,
			layout = "standard",
		} = data;
		const { width, height } = canvasSize;

		const widthInt = Number.parseInt(String(width).replace("mm", "").trim(), 10);
		const heightInt = Number.parseInt(
			String(height).replace("mm", "").trim(),
			10,
		);

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
		if (!user?.companyId) {
			return NextResponse.json(
				{ error: "Требуется наличие компании" },
				{ status: 401 },
			);
		}

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

		const templateLayout = toPrismaTemplateLayout(layout);
		if (
			templateLayout === "NOMENCLATURE_DETAILS" &&
			templateType !== "NOMENCLATURE"
		) {
			return NextResponse.json(
				{ error: "Этот макет доступен только для номенклатуры" },
				{ status: 400 },
			);
		}

		const filteredFields = textFields.filter(
			(field: TemplateFieldInput) => field.field && field.field.trim() !== "",
		);
		const normalizedQrPosition: "LEFT" | "RIGHT" | "CENTER" =
			isNomenclatureDetailsLayout(layout)
				? "RIGHT"
				: qrPosition === "left"
					? "LEFT"
					: qrPosition === "center"
						? "CENTER"
						: "RIGHT";
		const normalizedQrType: "QR" | "DATAMATRIX" =
			String(qrType).toLowerCase() === "datamatrix" ? "DATAMATRIX" : "QR";

		const template = await prisma.printingTemplate.create({
			data: {
				name: name || "Новый шаблон",
				type: templateType,
				layout: templateLayout,
				qrPosition: normalizedQrPosition,
				width: widthInt,
				height: heightInt,
				qrType: normalizedQrType,
				company: {
					connect: { id: user.companyId },
				},
				fields: {
					create: filteredFields.map(
						(field: TemplateFieldInput, index: number) => ({
							order: index + 1,
							fieldType: toPrismaTemplateFieldType(field.field),
							isBold: field.bold,
							fontSize: field.size,
						}),
					),
				},
			},
		});

		return NextResponse.json(
			{ message: "Шаблон успешно создан", template },
			{ status: 200 },
		);
	} catch (error: unknown) {
		console.error("Ошибка сохранения шаблона:", error);
		return NextResponse.json(
			{ error: "Ошибка при сохранении шаблона" },
			{ status: 500 },
		);
	}
}
