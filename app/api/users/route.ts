import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get('search') || '';

  try {
    // Query the database
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true, // Include fields you need
      },
    });

    // Return the results as JSON
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
