import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;

    switch (user?.role) {
      case 'ADMIN': {
        const nomenclatures = await prisma.nomenclature.findMany({
          include: {
            codePacks: {
              include: {
                _count: {
                  select: {
                    codes: true,
                  },
                },
              },
            },
          },
        });
        const formattedNomenclatures = nomenclatures.map(nomenclature => {
          const totalCodes = nomenclature.codePacks.reduce(
            (sum, codePack) => sum + (codePack._count?.codes || 0),
            0,
          );

          return {
            ...nomenclature,
            code_count: totalCodes,
          };
        });
        return NextResponse.json(formattedNomenclatures, { status: 200 });
      }

      case 'COMPANY_ADMIN':
      case 'COMPANY_USER': {
        if (!user.companyId) {
          return NextResponse.json(
            { message: 'User does not have a company' },
            { status: 400 },
          );
        }

        const nomenclatures = await prisma.nomenclature.findMany({
          where: {
            companyId: user.companyId,
          },
          include: {
            _count: {
              select: {
                codes: true, // Count the related codes
              },
            },
          },
        });

        const formattedNomenclatures = nomenclatures.map(nomenclature => ({
          ...nomenclature,
          code_count: nomenclature._count?.codes || 0, // Add code_count to the response
        }));

        return NextResponse.json(formattedNomenclatures, { status: 200 });
      }

      default:
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error: unknown) {
    console.error('GET /api/nomenclatures', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;

    if (!user?.companyId) {
      return NextResponse.json(
        { message: 'User does not have a company' },
        { status: 400 },
      );
    }

    const { name } = await req.json();

    const newNomenclature = await prisma.nomenclature.create({
      data: {
        name,
        company: {
          connect: {
            id: user.companyId,
          },
        },
      },
    });

    return NextResponse.json(newNomenclature, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/nomenclatures', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
