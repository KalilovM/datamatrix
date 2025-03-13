import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER";
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    role: "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER";
    email?: string;
  }
}
