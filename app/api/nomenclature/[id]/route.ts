import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const nomenclatureId = (await params).id;
    const cookiesStore = await cookies();
    console.log(cookiesStore.getAll());

    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const nomenclature = await prisma.nomenclature.findUnique({
      where: { id: nomenclatureId },
      select: {
        id: true,
        name: true,
        configurations: {
          select: {
            id: true,
            pieceInPack: true,
            packInPallet: true,
          },
        },
        codes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!nomenclature) {
      return NextResponse.json(
        { message: 'Nomenclature not found' },
        { status: 404 },
      );
    }

    // Transform configurations into the desired format
    const formattedConfigurations = nomenclature.configurations.map(config => ({
      label: `1-${config.pieceInPack}-${config.packInPallet}`,
      value: {
        packCount: config.pieceInPack,
        palletCount: config.packInPallet,
      },
    }));

    return NextResponse.json(
      {
        ...nomenclature,
        configurations: formattedConfigurations,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('GET /api/nomenclature/[id]', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
