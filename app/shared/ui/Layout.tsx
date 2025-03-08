"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { useUser } from "@/shared/model/useUser";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  className?: string;
  children: ReactNode;
}

export default function Layout({ children, className }: LayoutProps) {
  const { user, isLoading } = useUser();

  if (isLoading) return <p className="text-center mt-10">Загрузка...</p>;
  if (!user) return null; // Prevent rendering for unauthorized users

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <Sidebar />
      <main
        className={clsx(
          "ml-64 mt-16 flex flex-1 gap-8 bg-blue-50 p-8 print:m-0 print:gap-0 print:p-0",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
