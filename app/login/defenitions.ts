import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().nonempty("Поле не должно быть пустым"),
  password: z.string().nonempty("Поле не должно быть пустым"),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
