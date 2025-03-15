"use server";

import { LogoSection } from "@/auth/ui/LogoSection";
import { LoginForm } from "@/auth/ui/LoginForm";

export default async function LoginPage() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center">
      <LogoSection />
      <LoginForm />
    </div>
  );
}
