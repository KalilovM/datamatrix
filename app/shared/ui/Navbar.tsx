"use client";

import { LogoIconWithText } from "@/shared/ui/logoIcons";
import Avatar from "./Avatar";
import { useUser } from "@/shared/model/useUser";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full flex-row items-center justify-between bg-white px-10 shadow-sm print:hidden">
      <LogoIconWithText />
      {user && <Avatar />}
    </nav>
  );
}
