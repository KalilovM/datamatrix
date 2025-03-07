"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/auth/model/schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/auth/ui/PasswordInput";
import { SubmitButton } from "@/auth/ui/SubmitButton";
import Link from "next/link";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginSchema) => {
    const result = await signIn("credentials", {
      redirect: true,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/companies");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col items-center space-y-4"
      >
        <h1 className="text-2xl font-bold">Личный кабинет</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="w-full">
          <input
            {...register("username")}
            type="text"
            placeholder="Логин"
            className={`w-full border p-2 ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <PasswordInput register={register} errors={errors} />
        <SubmitButton loading={false} />
        <Link href="#" className="text-blue-500 hover:underline">
          Восстановить пароль
        </Link>
      </form>
    </div>
  );
}
