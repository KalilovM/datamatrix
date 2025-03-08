"use client";

import { useActionState } from "react";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { login } from "@/app/login/actions";

export default function LoginForm() {
  const [state, action] = useActionState(login, undefined);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <form
        className="flex w-full max-w-sm flex-col items-center space-y-4"
        action={action}
      >
        <h1 className="text-2xl font-bold">Личный кабинет</h1>
        <div className="w-full">
          <input
            name="username"
            type="text"
            placeholder="Логин"
            className={`w-full border p-2 ${
              state?.errors?.username ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {state?.errors?.username && (
            <p className="mt-1 text-sm text-red-500">{state.errors.username}</p>
          )}
        </div>
        <PasswordInput state={state} />
        <SubmitButton />
        <Link href="#" className="text-blue-500 hover:underline">
          Восстановить пароль
        </Link>
      </form>
    </div>
  );
}
