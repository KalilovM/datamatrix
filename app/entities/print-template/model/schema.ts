import { z } from "zod";

export const canvasSizeSchema = z.string().transform((value) => {
	const [width, height] = value.split(" x ");
	return { width, height };
});

export const printTemplateSchema = z.object({
	name: z.string().min(1, "Название шаблона обязательно"),
	type: z.enum(["aggregation", "nomenclature"]),
	qrPosition: z.enum(["left", "right", "center"]),
	canvasSize: canvasSizeSchema,
	textFields: z
		.array(
			z
				.object({
					field: z.string().optional(),
					bold: z.boolean(),
					size: z.number().int().min(8).max(32),
				})
				.optional(),
		)
		.optional(),
});

export type PrintTemplateFormValues = z.infer<typeof printTemplateSchema>;
