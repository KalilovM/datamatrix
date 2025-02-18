"use client";
import { useState } from "react";
import { Nomenclature } from "@prisma/client";
import { useRouter } from "next/navigation";
import NomenclatureRow from "../nomenclature/NomenclatureRow";

interface CompaniesTableProps {
  nomenclatures: Nomenclature[];
}

export default function NomenclatureTable({
  nomenclatures,
}: CompaniesTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="table-layout">
      <div className="table-header">
        <p className="table-header-title">Номенклатуры</p>
        <button
          className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
          onClick={() => {
            router.push("/nomenclature/create");
          }}
        >
          Создать
        </button>
      </div>
      <div className="table-rows-layout">
        {nomenclatures.map((nomenclature) => (
          <NomenclatureRow
            key={nomenclature.id}
            nomenclature={nomenclature}
            onSelect={setSelectedCompany}
            selectedCompanyId={selectedCompany}
          />
        ))}
      </div>
    </div>
  );
}
