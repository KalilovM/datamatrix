'use server';

import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import useAuthStore from '@/stores/useAuthStore';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user || user.password !== password) {
    return {
      errors: {
        username: ['Неверный логин или пароль'],
      },
    };
  }

  await createSession(user.id, user.role);

  const setUser = useAuthStore.getState().setUser;
  setUser({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  redirect('/companies');
}
