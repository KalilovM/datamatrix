import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ message: "Вы успешно вышли" });
  res.cookies.delete("session");
  res.cookies.set("foo", "bar");
  return res;
}
