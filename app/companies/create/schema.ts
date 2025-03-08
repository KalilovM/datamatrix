import { z } from "zod";

export const NewCompanySchema = z.object({
	name: z.string().min(3, "Наименование должно содержать не менее 3 символов"),
	token: z.string().min(1, "Токен компании обязателен"),
	subscriptionEnd: z.string().min(1, "Дата окончания подписки обязательна"),
	users: z.array(z.string().uuid("Некорректный UUID для пользователя")),
});
