import { z } from "zod";

export const counteragentSchema = z.object({
	name: z.string().min(1, "Наименование обязательно"),
	inn: z
		.string()
		.regex(/^\d{10}$/, "ИНН должен содержать 10 цифр")
		.optional(),
});

export type Counteragent = z.infer<typeof counteragentSchema>;
