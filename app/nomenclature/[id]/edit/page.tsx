import MainLayout from "@/components/MainLayout";
import NomenclatureEditForm from "@/components/nomenclature/NomenclatureEditForm";
import { getNomenclatureById } from "./action";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const nomenclatureId = (await params).id;
  const nomenclature = await getNomenclatureById(nomenclatureId);

  if (!nomenclature) {
    return (
      <MainLayout>
        <p>Номенклатура не найдена</p>
      </MainLayout>
    );
  }

  const initialData = {
    id: nomenclature.id,
    name: nomenclature.name || "",
    modelArticle: nomenclature.modelArticle || "",
    color: nomenclature.color || "",
    size: nomenclature.size || "",
    configurations: nomenclature.configurations.map((cfg) => ({
      label: `1-${cfg.pieceInPack}-${cfg.packInPallet}`,
      value: {
        peaceInPack: cfg.pieceInPack,
        packInPallet: cfg.packInPallet,
        id: cfg.id,
      },
    })),
    codes: nomenclature.codePacks.map((pack) => ({
      id: pack.id,
      name: pack.name,
    })),
  };

  return (
    <MainLayout>
      <NomenclatureEditForm initialData={initialData} />
    </MainLayout>
  );
}
