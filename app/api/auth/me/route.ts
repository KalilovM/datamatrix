import { NextResponse, NextRequest } from 'next/server';
import { clearSession } from '@/lib/session';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return redirectToLogin(req);
    }
    const user = session.user;

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

async function redirectToLogin(req: NextRequest) {
  console.log('hello redirect to login');
  await clearSession();
  const response = NextResponse.redirect(new URL('/login', req.nextUrl));

  return response;
}
