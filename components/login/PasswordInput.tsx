"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@/components/Icons";
import { FormState } from "@/app/login/defenitions";

export default function PasswordInput({ state }: { state: FormState }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Пароль"
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <span
          className="absolute right-3 flex cursor-pointer items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </span>
      </div>
      {state?.errors?.password && (
        <p className="mt-1 text-sm text-red-500">{state.errors.password}</p>
      )}
    </div>
  );
}
