import { z } from "zod";

export const ConfigurationSchema = z.object({
	label: z.string().min(1, "Наименование конфигурации не может быть пустым"),
	value: z.object({
		pieceInPack: z
			.number()
			.min(0, "Количество в упаковке должно быть не менее 0"),
		packInPallet: z
			.number()
			.min(0, "Количество в поддоне должно быть не менее 0"),
	}),
});

export const CodeSchema = z.object({
	fileName: z.string().min(1, "Имя файла не может быть пустым"),
	content: z.string().min(1, "Содержимое файла не может быть пустым"),
	size: z.string().min(1, "Размер обязателен"),
	GTIN: z.string().min(1, "GTIN обязателен"),
});

export const NomenclatureSchema = z.object({
	name: z.string().min(3, "Наименование должно содержать не менее 3 символов"),
	modelArticle: z.string().min(1, "Модель обязательна"),
	color: z.string().min(1, "Цвет обязателен"),
	configurations: z.array(ConfigurationSchema).optional(),
	codes: z.array(CodeSchema).optional(),
	gtinSize: z
		.array(
			z.object({
				id: z.string().optional(),
				GTIN: z.string(),
				size: z.number(),
			}),
		)
		.optional(),
});

export type NomenclatureFormData = z.infer<typeof NomenclatureSchema>;
export type ConfigurationData = z.infer<typeof ConfigurationSchema>;
export type CodeData = z.infer<typeof CodeSchema>;

export const ConfigurationEditSchema = z.object({
	id: z.string().optional(),
	label: z.string().min(1, "Наименование конфигурации не может быть пустым"),
	value: z.object({
		pieceInPack: z
			.number()
			.min(0, "Количество в упаковке должно быть не менее 0"),
		packInPallet: z
			.number()
			.min(0, "Количество в поддоне должно быть не менее 0"),
	}),
});

export const CodeEditSchema = z.object({
	id: z.string().optional(),
	fileName: z.string().min(1, "Имя файла не может быть пустым"),
	content: z.string(),
	codes: z.array(z.string()).optional(),
	size: z.string().min(1, "Размер обязателен"),
	GTIN: z.string().min(1, "GTIN обязателен"),
});

export const NomenclatureEditSchema = z.object({
	id: z.string().min(1, "Идентификатор обязателен"),
	name: z.string().min(3, "Наименование должно содержать не менее 3 символов"),
	modelArticle: z.string().min(1, "Модель обязательна"),
	color: z.string().min(1, "Цвет обязателен"),
	configurations: z.array(ConfigurationEditSchema).optional(),
	codes: z.array(CodeEditSchema).optional(),
	gtinSize: z
		.array(
			z.object({
				id: z.string().optional(),
				GTIN: z.string(),
				size: z.number(),
			}),
		)
		.optional(),
});

export type NomenclatureEditData = z.infer<typeof NomenclatureEditSchema>;
export type ConfigurationEditData = z.infer<typeof ConfigurationEditSchema>;
export type CodeEditData = z.infer<typeof CodeEditSchema>;
