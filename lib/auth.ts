import { User } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

const SESSION_EXPIRY_DAYS = 7;

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, role: string) {
  const token = await encrypt({ userId, role });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return session;
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as { userId: string; role: string };
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

export async function encrypt(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    )
    .sign(encodedKey);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          company: true,
          permissions: true,
        },
      },
    },
  });

  if (!session || new Date() > session.expiresAt) {
    return null;
  }

  return session.user;
}
