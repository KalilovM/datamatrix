import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const PRINT_TYPE = "AGGREGATION"

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(null, { status: 401 });
  }
  const { companyId } = session.user;
  if (!companyId) return NextResponse.json(null);

  const template = await prisma.printingTemplate.findFirst({
    where: { companyId, isDefault: true, type: PRINT_TYPE },
    include: { fields: true },
  });

  return NextResponse.json(template);
}
