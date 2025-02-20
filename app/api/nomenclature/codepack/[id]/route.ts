import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const codePackId = (await params).id;
  await prisma.codePack.delete({
    where: {
      id: codePackId,
    },
  });
  return new Response("Success!", {
    status: 200,
  });
}
