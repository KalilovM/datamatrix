"use client";
import dynamic from "next/dynamic";
import { Company } from "@/app/users/create/definitions";
import { useActionState } from "react";
import { createUser } from "@/app/users/create/actions";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface UserCreateFormProps {
  companies: Company[];
}

export default function UserCreateForm({ companies }: UserCreateFormProps) {
  const [state, action] = useActionState(createUser, undefined);

  return (
    <form className="table-layout" action={action}>
      <div className="table-header">
        <p className="table-header-title">Новый пользователь</p>
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
          >
            Сохранить
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-8 py-3">
        {/* First row: Email & Username */}
        <div className="w-full flex flex-row gap-16">
          {/* Email */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="email" className="block">
              Электронная почта
            </label>
            <input
              name="email"
              type="email"
              required
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {state?.errors?.email && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.email)
                  ? state.errors.email.join(", ")
                  : state.errors.email}
              </p>
            )}
          </div>
          {/* Username */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="username" className="block">
              Имя пользователя
            </label>
            <input
              name="username"
              type="text"
              required
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {state?.errors?.username && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.username)
                  ? state.errors.username.join(", ")
                  : state.errors.username}
              </p>
            )}
          </div>
        </div>

        {/* Second row: Password & Role */}
        <div className="w-full flex flex-row gap-16">
          {/* Password */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="password" className="block">
              Пароль
            </label>
            <input
              name="password"
              type="password"
              required
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {state?.errors?.password && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.password)
                  ? state.errors.password.join(", ")
                  : state.errors.password}
              </p>
            )}
          </div>
          {/* Role */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="role" className="block">
              Роль
            </label>
            <select
              name="role"
              required
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Выберите роль</option>
              <option value="ADMIN">Администратор</option>
              <option value="COMPANY_ADMIN">Админ фирмы</option>
              <option value="COMPANY_USER">Пользователь фирмы</option>
            </select>
            {state?.errors?.role && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.role)
                  ? state.errors.role.join(", ")
                  : state.errors.role}
              </p>
            )}
          </div>
        </div>

        {/* Third row: Company (optional) */}
        <div className="w-full flex flex-col">
          <label htmlFor="companyId" className="block">
            Компания
          </label>
          <Select
            name="companyId"
            options={companies.map((company) => ({
              value: company.id,
              label: company.name,
            }))}
            isClearable
            classNamePrefix="react-select"
          />
          {state?.errors?.companyId && (
            <p className="mt-1 text-sm text-red-500">
              {Array.isArray(state.errors.companyId)
                ? state.errors.companyId.join(", ")
                : state.errors.companyId}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
