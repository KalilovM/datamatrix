import { z } from "zod";

export type FormState =
  | {
      errors?: {
        email?: string;
        username?: string;
        password?: string;
        role?: string;
        companyId?: string;
      };
      message?: string;
    }
  | undefined;

export const UpdateUserSchema = z.object({
  id: z.string().uuid({ message: "Некорректный UUID пользователя" }),
  email: z.string().email({ message: "Неверный формат электронной почты" }),
  username: z
    .string()
    .min(3, {
      message: "Имя пользователя должно содержать не менее 3 символов",
    })
    .max(255, { message: "Имя пользователя не должно превышать 255 символов" }),
  // Password is optional; if provided it must be at least 8 characters.
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов" })
    .optional(),
  role: z.enum(["ADMIN", "COMPANY_ADMIN", "COMPANY_USER"], {
    errorMap: () => ({ message: "Неверное значение для роли" }),
  }),
  // companyId is optional.
  companyId: z
    .string()
    .uuid({ message: "Некорректный UUID для компании" })
    .optional(),
});
