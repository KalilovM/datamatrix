import { z } from "zod";

export const ConfigurationSchema = z.object({
	label: z.string().min(1),
	value: z.object({
		pieceInPack: z.number().min(0),
		packInPallet: z.number().min(0),
	}),
});

export const CodeSchema = z.object({
	fileName: z.string().min(1),
	content: z.string().min(1),
	size: z.string().min(1),
	GTIN: z.string().min(1),
});

export const NomenclatureSchema = z.object({
	name: z.string().min(3),
	modelArticle: z.string().min(1),
	color: z.string().min(1),
	configurations: z.array(ConfigurationSchema).optional(),
	codes: z.array(CodeSchema).optional(),
});

export const NomenclatureEditSchema = NomenclatureSchema.extend({
	id: z.string().min(1),
	configurations: z
		.array(ConfigurationSchema.extend({ id: z.string().optional() }))
		.optional(),
	codes: z
		.array(
			CodeSchema.extend({
				id: z.string().optional(),
				codes: z.array(z.string()).optional(),
			}),
		)
		.optional(),
});
