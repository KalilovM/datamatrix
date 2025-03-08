import { z } from "zod";

export const NewCompanySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Наименование должно содержать не менее 3 символов" })
    .max(255, { message: "Наименование не должно превышать 255 символов" }),
  token: z.string().uuid({ message: "Неверный формат токена" }),
  subscriptionEnd: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    },
    z.date({
      invalid_type_error: "Неверный формат даты окончания подписки",
      required_error: "Дата окончания подписки обязательна",
    }),
  ),
  users: z.array(
    z.string().uuid({ message: "Некорректный UUID для пользователя" }),
  ),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        token?: string[];
        subscriptionEnd?: string[];
        users?: string[];
      };
      message?: string;
    }
  | undefined;
