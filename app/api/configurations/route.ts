// app/api/configurations/route.ts
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

    // Add logic for different roles if needed
    const configurations = await prisma.configuration.findMany({
      select: {
        id: true,
        pieceInPack: true,
        packInPallet: true,
      },
    });

    const formattedConfigurations = configurations.map(config => ({
      label: `1-${config.pieceInPack}-${config.packInPallet}`,
      value: {
        packCount: config.pieceInPack,
        palletCount: config.packInPallet,
      },
    }));

    return NextResponse.json(formattedConfigurations, { status: 200 });
  } catch (error: unknown) {
    console.error('GET /api/configurations', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { nomenclatureId, packCount, palletCount } = await req.json();

    // Validate input
    if (!nomenclatureId || !packCount || !palletCount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check user session
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Optionally validate user role
    const user = session.user;
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Create configuration in the database
    const configuration = await prisma.configuration.create({
      data: {
        nomenclatureId,
        pieceInPack: parseInt(packCount, 10),
        packInPallet: parseInt(palletCount, 10),
      },
    });

    // Respond with the created configuration
    return NextResponse.json(configuration, { status: 201 });
  } catch (error) {
    console.error('Error creating configuration:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
