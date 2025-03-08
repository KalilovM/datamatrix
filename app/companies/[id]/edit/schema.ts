import { z } from "zod";

export const EditCompanySchema = z.object({
	name: z.string().min(3, "Наименование должно содержать не менее 3 символов"),
	subscriptionEnd: z.string().min(1, "Дата окончания подписки обязательна"),
	token: z.string().min(1, "Токен компании обязателен"),
	users: z.array(z.string().uuid("Некорректный UUID для пользователя")),
});

export type EditCompanyFormValues = z.infer<typeof EditCompanySchema>;
