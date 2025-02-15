import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";

const protectedRoutes = ["/", "/companies", "/nomenclature"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Fetch session cookie
  const sessionCookie = req.cookies.get("session")?.value;

  // Decrypt session
  let session = null;
  if (sessionCookie) {
    try {
      session = await decrypt(sessionCookie);
      if (!session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
      console.error("Failed to decrypt session:", error);
    }
  }

  // Redirect logic
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  } else if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/companies", req.nextUrl));
  }

  return NextResponse.next();
}
