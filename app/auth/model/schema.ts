import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(5, "Пароль должен быть не менее 5 символов"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
