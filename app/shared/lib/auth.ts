import { prisma } from "@/shared/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	useSecureCookies: process.env.NODE_ENV === "production",
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
					},
				});

				if (!user || !user.password)
					throw new Error("Неверный логин или пароль");
				if (!user.role)
					throw new Error("Пользователь не имеет назначенной роли");

				const isValid = credentials.password === user.password;
				if (!isValid) throw new Error("Неверный логин или пароль");

				return {
					id: user.id,
					name: user.username,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role as "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER";
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			session.user.role = token.role as
				| "ADMIN"
				| "COMPANY_ADMIN"
				| "COMPANY_USER";
			session.user.email = token.email as string;
			return session;
		},
		async redirect({ url, baseUrl }) {
			// If url is relative, prepend current baseUrl
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`;
			}
			// If url already matches current baseUrl, return it
			if (url.startsWith(baseUrl)) {
				return url;
			}
			// Default redirect to companies page
			return `${baseUrl}/companies`;
		},
	},
	session: { strategy: "jwt" },
	pages: {
		signIn: "/auth",
	},
};
