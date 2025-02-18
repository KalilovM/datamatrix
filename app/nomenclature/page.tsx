import MainLayout from "@/components/MainLayout";
import { getNonmenclatures } from "./actions";
import NomenclatureTable from "@/components/nomenclature/NomenclatureTable";

export default async function Page() {
  const nomenclatures = await getNonmenclatures();

  return (
    <MainLayout>
      <NomenclatureTable nomenclatures={nomenclatures} />
    </MainLayout>
  );
}
