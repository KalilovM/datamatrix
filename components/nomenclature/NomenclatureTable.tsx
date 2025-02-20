"use client";
import { useRouter } from "next/navigation";
import NomenclatureRow from "../nomenclature/NomenclatureRow";

export interface Nomenclature {
  id: string;
  name: string;
  codeCount: number;
}

interface NomenclatureTableProps {
  nomenclatures: Nomenclature[];
}

export default function NomenclatureTable({
  nomenclatures,
}: NomenclatureTableProps) {
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
          <NomenclatureRow key={nomenclature.id} nomenclature={nomenclature} />
        ))}
      </div>
    </div>
  );
}
