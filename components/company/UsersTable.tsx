"use client";
import { useState } from "react";
import { User } from "@prisma/client";
import CompanyRow from "./CompanyRow";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  companies: User[];
}

export default function UsersTable({ companies }: UsersTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="table-layout">
      <div className="table-header">
        <p className="table-header-title">Компании</p>
        <button
          className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
          onClick={() => {
            router.push("/companies/create");
          }}
        >
          Создать
        </button>
      </div>
      <div className="table-rows-layout">
        {companies.map((company) => (
          <CompanyRow
            key={company.id}
            company={company}
            onSelect={setSelectedCompany}
            selectedCompanyId={selectedCompany}
          />
        ))}
      </div>
    </div>
  );
}
