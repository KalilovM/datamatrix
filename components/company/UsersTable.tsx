"use client";
import { useState } from "react";
import CompanyRow from "./CompanyRow";
import { useRouter } from "next/navigation";
import { User } from "@/app/users/defenitions";
import UserRow from "./UserRow";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="table-layout">
      <div className="table-header">
        <p className="table-header-title">Пользователи</p>
        <button
          className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
          onClick={() => {
            router.push("/users/create");
          }}
        >
          Создать
        </button>
      </div>
      <div className="table-rows-layout">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onSelect={setSelectedCompany}
            selectedCompanyId={selectedCompany}
          />
        ))}
      </div>
    </div>
  );
}
