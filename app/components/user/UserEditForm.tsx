"use client";
import dynamic from "next/dynamic";
import { updateUser } from "@/app/users/[id]/edit/actions";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  companyId: string | null;
}

interface Company {
  id: string;
  name: string;
}

const Select = dynamic(() => import("react-select"), { ssr: false });

interface UserEditFormProps {
  user: User;
  companies: Company[];
}

export default function UserEditForm({ user, companies }: UserEditFormProps) {
  const [state, action] = useActionState(updateUser, undefined);
  const router = useRouter();

  return (
    <form className="table-layout" action={action}>
      {/* Hidden field for user ID */}
      <input type="hidden" name="id" value={user.id} />

      <div className="table-header">
        <p className="table-header-title">Редактирование пользователя</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/users")}
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
        {/* Row 1: Email and Username */}
        <div className="w-full flex flex-row gap-16">
          {/* Электронная почта */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="email" className="block">
              Электронная почта
            </label>
            <input
              name="email"
              type="email"
              defaultValue={user.email}
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
          {/* Имя пользователя */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="username" className="block">
              Имя пользователя
            </label>
            <input
              name="username"
              type="text"
              defaultValue={user.username}
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

        {/* Row 2: Role and Password */}
        <div className="w-full flex flex-row gap-16">
          {/* Роль */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="role" className="block">
              Роль
            </label>
            <select
              name="role"
              defaultValue={user.role}
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

          {/* Пароль */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="password" className="block">
              Новый пароль (оставьте пустым, если не требуется)
            </label>
            <input
              name="password"
              type="password"
              placeholder="Введите новый пароль"
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
        </div>

        {/* Row 3: Company selection (optional) */}
        <div className="w-full flex flex-col">
          <label htmlFor="companyId" className="block">
            Компания (необязательно)
          </label>
          <Select
            name="companyId"
            defaultValue={
              user.companyId
                ? {
                    value: user.companyId,
                    label:
                      companies.find((company) => company.id === user.companyId)
                        ?.name || "",
                  }
                : null
            }
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
