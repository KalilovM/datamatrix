import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/", "/companies", "/nomenclature"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  return NextResponse.next();
}
