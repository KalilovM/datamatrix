import { prisma } from "@/shared/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
					select: {
						id: true,
						username: true,
						email: true,
						password: true,
						role: true,
						companyId: true,
					},
				});

				if (!user || !user.password) throw new Error("Пользователь не найден");

				const isValid = credentials.password === user.password;
				if (!isValid) throw new Error("Неверный пароль");

				return {
					id: user.id,
					name: user.username,
					email: user.email,
					role: user.role,
					companyId: user.companyId,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role as "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER";
				token.companyId = user.companyId;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.role = token.role as
				| "ADMIN"
				| "COMPANY_ADMIN"
				| "COMPANY_USER";
			session.user.companyId = token.companyId;
			session.user.email = token.email as string;
			return session;
		},
		async redirect({ baseUrl }) {
			return `${baseUrl}/companies`;
		},
	},
	session: { strategy: "jwt" },
	pages: {
		signIn: "/auth",
	},
};
