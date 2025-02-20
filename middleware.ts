import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";

const protectedRoutes = ["/", "/companies", "/nomenclature"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Get the session cookie (if it exists)
  const sessionCookie = req.cookies.get("session")?.value;

  // Try to decrypt the session token.
  // Note: decrypt catches its own errors and returns null on failure.
  let session = sessionCookie ? await decrypt(sessionCookie) : null;
  // If there was a session cookie but decryption failed (or returned a null payload)
  if (sessionCookie && !session) {
    const response = NextResponse.redirect(new URL("/login", req.nextUrl));
    // Remove the invalid session cookie
    response.cookies.delete("session");
    return response;
  }

  // Redirect logic:
  // If the route is protected and there is no valid session, redirect to login.
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  // If the route is public (e.g. login) and the user already has a session, send them to a protected page.
  else if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/companies", req.nextUrl));
  }

  return NextResponse.next();
}
