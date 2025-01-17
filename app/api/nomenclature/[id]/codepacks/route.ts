import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

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

    const codePacks = await prisma.codePack.findMany({
      where: { nomenclatureId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            codes: true,
          },
        },
      },
    });

    return NextResponse.json(codePacks, { status: 200 });
  } catch (error: unknown) {
    console.error('GET /api/nomenclature/codepacks', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// POST: Parse CSV files and create codes for each row
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

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    console.log(files);

    if (!nomenclatureId || !files || !Array.isArray(files)) {
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

    const results = [];
    for (const file of files) {
      const fileName = file.name;
      const csvContent = await file.text();

      // Parse CSV rows
      const rows = parse(csvContent, {
        skip_empty_lines: true,
      });

      const codePack = await prisma.codePack.create({
        data: {
          name: fileName,
          nomenclatureId,
        },
      });

      const codes = rows.map((row: string[]) => ({
        value: row[0],
        codePackId: codePack.id,
      }));

      await prisma.code.createMany({
        data: codes,
      });

      results.push({
        codePackName: fileName,
        codesCreated: codes.length,
      });
    }

    return NextResponse.json(
      { message: 'Code Packs and Codes added successfully', results },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('POST /api/nomenclature/codepacks', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
