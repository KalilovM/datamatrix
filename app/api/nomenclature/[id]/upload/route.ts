import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { parse } from 'csv-parse/sync';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const nomenclatureId = (await params).id;

    // Validate session
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get uploaded files
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    console.log('files', files);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: 'No files uploaded' },
        { status: 400 },
      );
    }

    const codePackResults = [];

    for (const file of files) {
      // Parse the CSV file
      const fileContent = await file.text();
      const records = parse(fileContent, {
        columns: false,
        skip_empty_lines: true,
      });
      console.log('records', records);

      if (!records || !Array.isArray(records) || records.length === 0) {
        return NextResponse.json(
          { message: `File ${file.name} is empty or invalid` },
          { status: 400 },
        );
      }

      // Create CodePack
      const codePack = await prisma.codePack.create({
        data: {
          name: file.name,
          nomenclatureId,
        },
      });

      // Create Codes
      const codes = records.map((record: string[]) => ({
        value: record[0], // Assuming each row has a single column with the code
        codePackId: codePack.id,
      }));
      console.log('codes', codes);

      await prisma.code.createMany({
        data: codes,
      });

      codePackResults.push({
        fileName: file.name,
        codePackId: codePack.id,
        codesCount: codes.length,
      });
    }

    return NextResponse.json(
      { message: 'Files uploaded successfully', codePacks: codePackResults },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error uploading codes:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
