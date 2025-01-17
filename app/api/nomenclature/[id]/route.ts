import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const nomenclatureId = (await params).id;
    console.log('NomenclatureID', nomenclatureId);

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
        codePacks: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                codes: true,
              },
            },
            createdAt: true,
          },
        },
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const nomenclatureId = (await params).id;
    console.log('NomenclatureID', nomenclatureId);
    const session = await getSession(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { name } = body;

    // Validate input
    if (!nomenclatureId || !name) {
      return NextResponse.json(
        { message: 'nomenclatureId and name are required' },
        { status: 400 },
      );
    }

    // Check if the nomenclature exists
    const existingNomenclature = await prisma.nomenclature.findUnique({
      where: { id: nomenclatureId },
    });

    if (!existingNomenclature) {
      return NextResponse.json(
        { message: 'Nomenclature not found' },
        { status: 404 },
      );
    }

    // Update the nomenclature name
    const updatedNomenclature = await prisma.nomenclature.update({
      where: { id: nomenclatureId },
      data: { name },
    });

    return NextResponse.json(
      {
        message: 'Nomenclature name updated successfully',
        updatedNomenclature,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('POST /api/nomenclature/update-name', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
