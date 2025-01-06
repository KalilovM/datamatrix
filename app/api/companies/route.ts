import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

interface PostBody {
  name: string;
  subscriptionEnd: string;
  token: string;
  userIds: string[];
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;

    switch (user?.role) {
      case 'ADMIN': {
        const companies = await prisma.company.findMany();
        return NextResponse.json(companies, { status: 200 });
      }
      case 'COMPANY_ADMIN':
      case 'COMPANY_USER': {
        if (!user.companyId) {
          return NextResponse.json(
            { message: 'User does not have a company' },
            { status: 400 },
          );
        }
        const company = await prisma.company.findUnique({
          where: {
            id: user.companyId,
          },
        });
        return NextResponse.json(company, { status: 200 });
      }
      default:
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error: unknown) {
    console.error('GET /api/companies', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const res: PostBody = await req.json();
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const company = await prisma.company.create({
      data: {
        name: res.name,
        token: res.token,
        subscriptionEnd: new Date(res.subscriptionEnd),
        users: {
          connect: res.userIds.map(id => ({ id })),
        },
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/companies', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
