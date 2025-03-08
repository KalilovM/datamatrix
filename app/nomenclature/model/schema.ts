import { z } from "zod";

export const ConfigurationSchema = z.object({
	label: z.string().min(1, "Наименование конфигурации не может быть пустым"),
	value: z.object({
		pieceInPack: z
			.number()
			.min(1, "Количество в упаковке должно быть не менее 1"),
		packInPallet: z
			.number()
			.min(1, "Количество в поддоне должно быть не менее 1"),
	}),
});

export const CodeSchema = z.object({
	fileName: z.string().min(1, "Имя файла не может быть пустым"),
	content: z.string().min(1, "Содержимое файла не может быть пустым"),
});

export const NomenclatureSchema = z.object({
	name: z.string().min(3, "Наименование должно содержать не менее 3 символов"),
	modelArticle: z.string().min(1, "Модель/Артикул обязательна"),
	color: z.string().min(1, "Цвет обязателен"),
	size: z.string().min(1, "Размер обязателен"),
	configurations: z.array(ConfigurationSchema).optional(),
	codes: z.array(CodeSchema).optional(),
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
			.min(1, "Количество в упаковке должно быть не менее 1"),
		packInPallet: z
			.number()
			.min(1, "Количество в поддоне должно быть не менее 1"),
	}),
});

export const CodeEditSchema = z.object({
	id: z.string().optional(),
	fileName: z.string().min(1, "Имя файла не может быть пустым"),
	content: z.string(),
	codes: z.array(z.string()).optional(),
});

export const NomenclatureEditSchema = z.object({
	id: z.string().min(1, "Идентификатор обязателен"),
	name: z.string().min(3, "Наименование должно содержать не менее 3 символов"),
	modelArticle: z.string().min(1, "Модель/Артикул обязательна"),
	color: z.string().min(1, "Цвет обязателен"),
	size: z.string().min(1, "Размер обязателен"),
	configurations: z.array(ConfigurationEditSchema).optional(),
	codes: z.array(CodeEditSchema).optional(),
});

export type NomenclatureEditData = z.infer<typeof NomenclatureEditSchema>;
export type ConfigurationEditData = z.infer<typeof ConfigurationEditSchema>;
export type CodeEditData = z.infer<typeof CodeEditSchema>;
