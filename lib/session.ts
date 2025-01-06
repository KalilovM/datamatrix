import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Session, Role } from '@prisma/client';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionWithUser extends Session {
  user: {
    id: string;
    username: string;
    email: string;
    role: Role;
    companyId: string | null;
  };
}

type SessionPayload = {
  userId: string;
  role: string;
  expiresAt: Date;
};

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionToken = await encrypt({ userId, role, expiresAt });

  const cookieStore = await cookies();
  const session = await prisma.session.create({
    data: {
      userId,
      token: sessionToken,
      expiresAt,
    },
  });
  cookieStore.set('session', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  });
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

export async function decrypt(
  token: string | undefined = '',
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function getActiveSession(
  userId: string,
): Promise<Session | null> {
  const session = await prisma.session.findFirst({
    where: {
      userId,
      expiresAt: {
        gte: new Date(),
      },
    },
  });
  return session ?? null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  });
}

export async function getSession(
  req: NextRequest,
): Promise<SessionWithUser | null> {
  const token = req.cookies.get('session')?.value;
  if (!token) return null;
  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: {
        gte: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          companyId: true,
        },
      },
    },
  });

  return session ?? null;
}
