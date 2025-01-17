import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all configurations for a nomenclature
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const nomenclatureId = (await params).id;
    const session = await getSession(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const configurations = await prisma.configuration.findMany({
      where: { nomenclatureId },
      select: {
        id: true,
        pieceInPack: true,
        packInPallet: true,
      },
    });

    return NextResponse.json(configurations, { status: 200 });
  } catch (error: unknown) {
    console.error('GET /api/nomenclature/configurations', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// POST: Add a list of configurations to a nomenclature
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const nomenclatureId = (await params).id;
    const session = await getSession(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const configurations = body;

    if (!nomenclatureId || !Array.isArray(configurations)) {
      return NextResponse.json(
        { message: 'Invalid input data' },
        { status: 400 },
      );
    }

    const existingNomenclature = await prisma.nomenclature.findUnique({
      where: { id: nomenclatureId },
    });

    if (!existingNomenclature) {
      return NextResponse.json(
        { message: 'Nomenclature not found' },
        { status: 404 },
      );
    }

    const createdConfigurations = await prisma.configuration.createMany({
      data: configurations.map(config => ({
        pieceInPack: Number(config.value.pieceInPack),
        packInPallet: Number(config.value.packInPallet),
        nomenclatureId,
      })),
    });

    return NextResponse.json(
      { message: 'Configurations added successfully', createdConfigurations },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('POST /api/nomenclature/configurations', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
