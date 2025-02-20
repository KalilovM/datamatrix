import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const nomenclatureId = (await params).id;
  await prisma.nomenclature.delete({
    where: {
      id: nomenclatureId,
    },
  });
  return new Response("Success!", {
    status: 200,
  });
}
