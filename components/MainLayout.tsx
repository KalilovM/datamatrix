import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <Sidebar />
      <div className="ml-64 mt-16 flex flex-1 flex-row gap-8 bg-blue-50 p-8">
        {children}
      </div>
    </div>
  );
}
