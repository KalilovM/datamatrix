import { z } from "zod";
import { Role } from "@prisma/client";

export interface Company {
  id: string;
  name: string;
}

export const NewUserSchema = z.object({
  email: z.string().email({ message: "Неверный формат электронной почты" }),
  username: z
    .string()
    .min(3, {
      message: "Имя пользователя должно содержать не менее 3 символов",
    })
    .max(255, { message: "Имя пользователя не должно превышать 255 символов" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов" }),
  role: z.nativeEnum(Role, { message: "Неверное значение для роли" }),
  companyId: z
    .string()
    .uuid({ message: "Некорректный UUID для компании" })
    .optional(),
});

export type FormState =
  | {
      errors?: {
        email?: string;
        username?: string;
        password?: string;
        role?: string;
        companyId?: string | null;
      };
      message?: string;
    }
  | undefined;
