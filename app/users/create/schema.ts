import { z } from "zod";

export const NewUserSchema = z.object({
	email: z.string().email("Некорректный email"),
	username: z
		.string()
		.min(3, "Имя пользователя должно содержать не менее 3 символов"),
	password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
	role: z.enum(["ADMIN", "COMPANY_ADMIN", "COMPANY_USER"]).nullable(),
	companyId: z
		.object({
			value: z.string(),
			label: z.string(),
		})
		.nullable()
		.optional(),
});
