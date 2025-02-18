import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const companyId = (await params).id;
  await prisma.company.delete({
    where: {
      id: companyId,
    },
  });
  return new Response("Success!", {
    status: 200,
  });
}
