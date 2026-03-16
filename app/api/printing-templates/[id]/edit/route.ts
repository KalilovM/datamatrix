import { prisma } from "@/shared/lib/prisma";
import type { TemplateFieldType } from "@prisma/client";
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
	type: "AGGREGATION" | "NOMENCLATURE";
	qrType: "QR" | "DATAMATRIX";
	qrPosition: "LEFT" | "RIGHT" | "CENTER";
	canvasSize: {
		width: number;
		height: number;
	};
	fields: PrintTemplateFieldInput[];
};

const toTemplateFieldType = (value: string): TemplateFieldType => {
	const normalized = value.toUpperCase();
	if (
		normalized === "NAME" ||
		normalized === "MODEL_ARTICLE" ||
		normalized === "COLOR" ||
		normalized === "SIZE"
	) {
		return normalized;
	}
	throw new Error(`Unsupported fieldType: ${value}`);
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
		qrType,
		qrPosition,
		canvasSize: { width, height },
		fields,
	} = (await req.json()) as UpdatePrintTemplatePayload;
	const { id } = await params;

	// Filter out fields with empty fieldType.
	const filteredFields = fields.filter((field) => field.fieldType !== "");

	// For fields with an id, use upsert.
	const upsertOperations = filteredFields
		.filter((field) => field.id && field.id !== "")
		.map((field) => ({
			where: { id: field.id },
			update: {
				fieldType: toTemplateFieldType(field.fieldType),
				isBold: field.isBold,
				fontSize: field.fontSize,
				order: field.order,
			},
			create: {
				fieldType: toTemplateFieldType(field.fieldType),
				isBold: field.isBold,
				fontSize: field.fontSize,
				order: field.order,
			},
		}));

	// For fields with an empty id, create new ones.
	const createOperations = filteredFields
		.filter((field) => !field.id || field.id === "")
		.map((field) => ({
			fieldType: toTemplateFieldType(field.fieldType),
			isBold: field.isBold,
			fontSize: field.fontSize,
			order: field.order,
		}));

	const updatedPrintTemplate = await prisma.printingTemplate.update({
		where: { id },
		data: {
			name: name,
			type: type,
			qrType: qrType,
			qrPosition: qrPosition,
			width: width,
			height: height,
			fields: {
				// Upsert existing fields.
				upsert: upsertOperations,
				// Create new fields.
				create: createOperations,
			},
		},
	});

	return NextResponse.json(updatedPrintTemplate, { status: 200 });
}
