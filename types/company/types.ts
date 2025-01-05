import { z } from 'zod';

export const userSchema = z
  .object({
    username: z.string().nonempty('Обязательное поле'),
    email: z.string().email('Неверный формат имейла'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    confirmPassword: z
      .string()
      .min(6, 'Пароль должен быть не менее 6 символов'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export const companySchema = z.object({
  name: z.string().nonempty('Наименование компании обязательно'),
  subscriptionEnd: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Неверный формат даты',
  }),
  token: z.string(),
  userId: z
    .array(z.string())
    .nonempty('Необходимо выбрать хотя бы одного пользователя'),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type CompanyFormValues = z.infer<typeof companySchema>;

export interface UserCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: { id: string; email: string; username: string }) => void;
}

export interface CompanyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: CompanyFormValues) => void;
}
