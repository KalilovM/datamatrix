import MainLayout from "@/components/MainLayout";
import { getNonmenclatures } from "./actions";
import NomenclatureRow from "@/components/nomenclature/NomenclatureRow";
import Link from "next/link";

export default async function Page() {
  const nomenclatures = await getNonmenclatures();

  return (
    <MainLayout>
      <div className="table-layout">
        <div className="table-header">
          <p className="table-header-title">Номенклатуры</p>
          <Link
            className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
            href="/nomenclature/create"
          >
            Создать
          </Link>
        </div>
        <div className="table-rows-layout">
          {nomenclatures.map((nomenclature) => (
            <NomenclatureRow
              key={nomenclature.id}
              nomenclature={nomenclature}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
