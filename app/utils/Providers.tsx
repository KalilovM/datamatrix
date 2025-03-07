"use client";

import React from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { SessionProvider } from "next-auth/react";

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
