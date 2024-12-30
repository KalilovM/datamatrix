'use server';

import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const testUser = {
  id: '1',
  username: 'admin',
  password: 'admin',
  role: 'admin',
};

export async function login(prevState: any, formData: FormData) {
  // 1. Fetching user from database
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  if (username !== testUser.username || password !== testUser.password) {
    return {
      errors: {
        username: ['Неверный логин или пароль'],
      },
    };
  }

  await createSession(testUser.id, testUser.role);
  redirect('/companies');
}
