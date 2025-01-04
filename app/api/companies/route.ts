import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

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
