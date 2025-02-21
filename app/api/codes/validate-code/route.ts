import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code } = await req.json();
  const exists = await prisma.code.findUnique({
    where: { value: code, used: false },
  });
  if (!exists) {
    return new Response(JSON.stringify({ exists: false }), { status: 404 });
  }
  return new Response(JSON.stringify({ exists: true }), { status: 200 });
}
