import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

const userSchema = z.object({
  username: z.string().nonempty('Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'COMPANY_ADMIN', 'COMPANY_USER']),
  companyId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Validate input
    const body = userSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json({ error: body.error.errors }, { status: 400 });
    }

    const { username, email, password, role, companyId } = body.data;

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: password,
        role,
        companyId: role !== 'ADMIN' ? companyId : null,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
