"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "./ReactQueryProvider";

interface ProvidersProps {
	children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<ReactQueryProvider>
			<SessionProvider>{children}</SessionProvider>
		</ReactQueryProvider>
	);
}
