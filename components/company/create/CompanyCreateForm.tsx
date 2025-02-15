"use client";
import dynamic from "next/dynamic";
import { User } from "@prisma/client";
import { createNewCompany } from "@/app/companies/create/actions";
import { useActionState } from "react";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface CompanyCreateFormProps {
  users: User[];
  companyToken: string;
}

export default function CompanyCreateForm({
  users,
  companyToken,
}: CompanyCreateFormProps) {
  const [state, action] = useActionState(createNewCompany, undefined);

  return (
    <form className="table-layout" action={action}>
      <div className="table-header">
        <p className="table-header-title">Новая компания</p>
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
        <div className="w-full flex flex-row gap-16">
          {/* Наименование */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="name" className="block">
              Наименование
            </label>
            <input
              name="name"
              type="text"
              required
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {state?.errors?.name && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.name)
                  ? state.errors.name.join(", ")
                  : state.errors.name}
              </p>
            )}
          </div>
          {/* Дата окончания подписки */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="subscriptionEnd" className="block">
              Дата окончания подписки
            </label>
            <input
              name="subscriptionEnd"
              type="date"
              required
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.subscriptionEnd
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {state?.errors?.subscriptionEnd && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.subscriptionEnd)
                  ? state.errors.subscriptionEnd.join(", ")
                  : state.errors.subscriptionEnd}
              </p>
            )}
          </div>
        </div>
        {/* Second row: Token & Administrators */}
        <div className="w-full flex flex-row gap-16">
          {/* Токен компании */}
          <div className="w-1/2 flex flex-col">
            <label htmlFor="token" className="block">
              Токен компании
            </label>
            <input
              type="text"
              name="token"
              value={companyToken}
              readOnly
              className={`w-full rounded-lg border px-3 py-2 text-gray-700 ${
                state?.errors?.token ? "border-red-500" : "border-gray-300"
              }`}
            />
            {state?.errors?.token && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.token)
                  ? state.errors.token.join(", ")
                  : state.errors.token}
              </p>
            )}
          </div>
          {/* Администраторы */}
          <div className="w-1/2 flex flex-col">
            <label className="block">Администраторы</label>
            <Select
              isMulti
              required
              name="users"
              options={users.map((user) => ({
                value: user.id,
                label: user.username,
              }))}
            />
            {state?.errors?.users && (
              <p className="mt-1 text-sm text-red-500">
                {Array.isArray(state.errors.users)
                  ? state.errors.users.join(", ")
                  : state.errors.users}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
