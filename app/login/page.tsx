'use client';

import LogoIcon from '@/app/components/LogoIcon';
import { EyeIcon, EyeSlashIcon } from '@/app/components/Icons';
import Link from 'next/link';
import { useState, useActionState } from 'react';
import { login } from '@/app/login/actions';
import { useFormStatus } from 'react-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="relative h-screen w-full">
      {/* Logo Section */}
      <div className="absolute left-0 top-0 p-6">
        <LogoIcon />
      </div>

      {/* Centered Form Section */}
      <div className="absolute inset-0 flex items-center justify-center">
        <form
          className="flex w-full max-w-sm flex-col items-center space-y-4"
          action={loginAction}
        >
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <div className="w-full">
            <input
              name="username"
              type="text"
              placeholder="Логин"
              className={`w-full border p-2 ${state?.errors?.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {state?.errors?.username && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.username}
              </p>
            )}
          </div>
          <div className="relative w-full">
            <div className="relative flex items-center">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                className={`w-full rounded-md border border-gray-300 p-2`}
              />
              <span
                className="absolute right-3 flex cursor-pointer items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
            </div>
          </div>
          <SubmitButton />
          <Link href="#" className="text-blue-500 hover:underline">
            Восстановить пароль
          </Link>
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
    >
      {pending ? 'Вход...' : 'Войти'}
    </button>
  );
}
