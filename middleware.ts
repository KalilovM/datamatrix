import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/', '/companies'];
const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const cookieSession = cookieStore.get('session')?.value;
  const session = await decrypt(cookieSession);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  } else if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/companies', req.nextUrl));
  }

  return NextResponse.next();
}
