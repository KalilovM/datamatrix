"use client";

import LogoIcon from "@/app/components/svgs/LogoIcon";
import EyeIcon from "@/app/components/svgs/EyeIcon";
import EyeSlashIcon from "@/app/components/svgs/EyeSlashIcon";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for validation
const loginSchema = z.object({
  username: z.string().min(1, "Логин обязателен"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    // TODO: Send data to backend
    console.log(data);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Logo Section */}
      <div className="absolute top-0 left-0 p-6">
        <LogoIcon />
      </div>

      {/* Centered Form Section */}
      <div className="absolute inset-0 flex items-center justify-center">
        <form
          className="flex flex-col items-center space-y-4 w-full max-w-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <div className="w-full">
            <input
              type="text"
              placeholder="Логин"
              className={`w-full p-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-md`}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="w-full relative">
            <div className="flex items-center relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                className={`w-full p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                {...register("password")}
              />
              <span
                className="absolute right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Войти
          </button>
          <Link href="#" className="text-blue-500 hover:underline">
            Восстановить пароль
          </Link>
        </form>
      </div>
    </div>
  );
}
