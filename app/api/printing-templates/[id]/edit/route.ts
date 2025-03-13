import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

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
	} = await req.json();
	const { id } = await params;

	// Filter out fields with empty fieldType.
	const filteredFields = fields.filter((field) => field.fieldType !== "");

	// For fields with an id, use upsert.
	const upsertOperations = filteredFields
		.filter((field) => field.id && field.id !== "")
		.map((field) => ({
			where: { id: field.id },
			update: {
				fieldType: field.fieldType.toUpperCase(),
				isBold: field.isBold,
				fontSize: field.fontSize,
				order: field.order,
			},
			create: {
				fieldType: field.fieldType.toUpperCase(),
				isBold: field.isBold,
				fontSize: field.fontSize,
				order: field.order,
			},
		}));

	// For fields with an empty id, create new ones.
	const createOperations = filteredFields
		.filter((field) => !field.id || field.id === "")
		.map((field) => ({
			fieldType: field.fieldType.toUpperCase(),
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
