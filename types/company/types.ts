import { z } from 'zod';

export const userSchema = z
  .object({
    username: z.string().nonempty('Обязательное поле'),
    email: z.string().email('Неверный формат имейла'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    role: z.enum(['ADMIN', 'COMPANY_ADMIN', 'COMPANY_USER']),
    confirmPassword: z
      .string()
      .min(6, 'Пароль должен быть не менее 6 символов'),
    companyId: z.string().optional(),
  })
  .refine(data => (data.role !== 'ADMIN' ? !!data.companyId : true), {
    path: ['companyId'],
    message: 'Компания обязательна для выбранной роли',
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
  userIds: z
    .array(z.string())
    .nonempty('Необходимо выбрать хотя бы одного пользователя'),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type CompanyFormValues = z.infer<typeof companySchema>;

export interface UserCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserFormValues) => void;
}

export interface CompanyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: CompanyFormValues) => void;
}
