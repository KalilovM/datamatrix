import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Неверный логин или пароль' },
        { status: 401 },
      );
    }

    await createSession(user.id, user.role);

    return NextResponse.redirect('/companies');
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: 'Ошибка авторизации' },
      { status: 500 },
    );
  }
}
