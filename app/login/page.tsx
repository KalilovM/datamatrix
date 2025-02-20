"use server";

import LogoSection from "@/components/login/LogoSection";
import LoginForm from "@/components/login/LoginForm";

export default async function LoginPage() {
  return (
    <div className="relative h-screen w-full">
      <LogoSection />
      <LoginForm />
    </div>
  );
}
