import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/shared/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Введите логин и пароль");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) throw new Error("Пользователь не найден");

        const isValid = credentials.password === user.password;
        if (!isValid) throw new Error("Неверный пароль");

        return { id: user.id, name: user.username, role: user.role } as const;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as
        | "ADMIN"
        | "COMPANY_ADMIN"
        | "COMPANY_USER";
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/companies`; // ✅ Auto-redirect after login
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
