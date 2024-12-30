import { z } from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().min(1, 'Логин обязателен'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
});
