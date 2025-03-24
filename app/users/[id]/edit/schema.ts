import { z } from "zod";

export const EditUserSchema = z.object({
	email: z.string().email("Некорректный email"),
	username: z
		.string()
		.min(3, "Имя пользователя должно содержать не менее 3 символов"),
	role: z.enum(["ADMIN", "COMPANY_ADMIN", "COMPANY_USER"]).nullable(),
	companyId: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.nullable()
		.optional(),
	password: z.string().min(5).optional().or(z.literal("")),
});
