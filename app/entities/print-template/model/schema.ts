import { z } from "zod";

export const canvasSizeSchema = z.object({
	width: z.string(),
	height: z.string(),
});

export const printTemplateSchema = z.object({
	name: z.string().min(1, "Название шаблона обязательно"),
	type: z.enum(["aggregation", "nomenclature"]),
	qrType: z.enum(["qr", "datamatrix"]),
	qrPosition: z.enum(["left", "right", "center"]),
	canvasSize: canvasSizeSchema,
	textFields: z
		.array(
			z.object({
				field: z.string().optional(),
				bold: z.boolean(),
				size: z.coerce.number().min(8).max(32),
			}),
		)
		.optional(),
});

export type PrintTemplateFormValues = z.infer<typeof printTemplateSchema>;
