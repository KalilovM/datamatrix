import { prisma } from "@/shared/lib/prisma";
import {
	isNomenclatureDetailsLayout,
	toPrismaTemplateFieldType,
	toPrismaTemplateLayout,
} from "@/shared/lib/printingTemplate";
import { NextResponse } from "next/server";

type PrintTemplateFieldInput = {
	id?: string;
	fieldType: string;
	isBold: boolean;
	fontSize: number;
	order: number;
};

type UpdatePrintTemplatePayload = {
	name: string;
	type: "AGGREGATION" | "NOMENCLATURE" | "aggregation" | "nomenclature";
	layout?: "STANDARD" | "NOMENCLATURE_DETAILS" | "standard" | "nomenclatureDetails";
	qrType: "QR" | "DATAMATRIX" | "qr" | "datamatrix";
	qrPosition: "LEFT" | "RIGHT" | "CENTER" | "left" | "right" | "center";
	canvasSize: {
		width: number | string;
		height: number | string;
	};
	fields: PrintTemplateFieldInput[];
};

const normalizeTemplateType = (
	value: UpdatePrintTemplatePayload["type"],
): "AGGREGATION" | "NOMENCLATURE" => {
	return String(value).toUpperCase() === "NOMENCLATURE"
		? "NOMENCLATURE"
		: "AGGREGATION";
};

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
			layout: true,
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

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const {
		name,
		type,
		layout = "standard",
		qrType,
		qrPosition,
		canvasSize: { width, height },
		fields,
	} = (await req.json()) as UpdatePrintTemplatePayload;
	const { id } = await params;

	const normalizedType = normalizeTemplateType(type);
	const normalizedLayout = toPrismaTemplateLayout(layout);

	if (
		normalizedLayout === "NOMENCLATURE_DETAILS" &&
		normalizedType !== "NOMENCLATURE"
	) {
		return NextResponse.json(
			{ error: "Этот макет доступен только для номенклатуры" },
			{ status: 400 },
		);
	}

	const filteredFields = (fields ?? []).filter((field) => field.fieldType !== "");
	const existingFieldIds = filteredFields
		.map((field) => field.id)
		.filter((fieldId): fieldId is string => Boolean(fieldId));
	const normalizedQrPosition: "LEFT" | "RIGHT" | "CENTER" =
		isNomenclatureDetailsLayout(layout)
			? "RIGHT"
			: String(qrPosition).toUpperCase() === "LEFT"
				? "LEFT"
				: String(qrPosition).toUpperCase() === "CENTER"
					? "CENTER"
					: "RIGHT";
	const normalizedQrType: "QR" | "DATAMATRIX" =
		String(qrType).toUpperCase() === "DATAMATRIX" ? "DATAMATRIX" : "QR";

	const upsertOperations = filteredFields
		.filter((field) => field.id)
		.map((field) => ({
			where: { id: field.id as string },
			update: {
				fieldType: toPrismaTemplateFieldType(field.fieldType),
				isBold: field.isBold,
				fontSize: field.fontSize,
				order: field.order,
			},
			create: {
				fieldType: toPrismaTemplateFieldType(field.fieldType),
				isBold: field.isBold,
				fontSize: field.fontSize,
				order: field.order,
			},
		}));

	const createOperations = filteredFields
		.filter((field) => !field.id)
		.map((field) => ({
			fieldType: toPrismaTemplateFieldType(field.fieldType),
			isBold: field.isBold,
			fontSize: field.fontSize,
			order: field.order,
		}));

	const updatedPrintTemplate = await prisma.printingTemplate.update({
		where: { id },
		data: {
			name,
			type: normalizedType,
			layout: normalizedLayout,
			qrType: normalizedQrType,
			qrPosition: normalizedQrPosition,
			width: Number(width),
			height: Number(height),
			fields: {
				deleteMany: existingFieldIds.length
					? {
							templateId: id,
							id: {
								notIn: existingFieldIds,
							},
						}
					: { templateId: id },
				upsert: upsertOperations,
				create: createOperations,
			},
		},
	});

	return NextResponse.json(updatedPrintTemplate, { status: 200 });
}
