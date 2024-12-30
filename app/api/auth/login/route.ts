import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (username === 'admin' && password === 'admin') {
      const role = 'admin';
      const token = btoa(JSON.stringify({ username, role }));

      return NextResponse.json(
        { token, role },
        {
          status: 200,
        },
      );
    } else if (username === 'user' && password === 'user') {
      const role = 'companyUser';
      const token = btoa(JSON.stringify({ username, role }));
      return NextResponse.json({ token, role }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: 'Неверный логин или пароль' },
        { status: 401 },
      );
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: 'Ошибка авторизации' },
      { status: 500 },
    );
  }
}
