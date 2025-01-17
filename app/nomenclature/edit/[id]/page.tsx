import ConfigsTable from '@/app/features/Configs/components/ConfigTable';
import MainLayout from '@/app/features/MainLayout';
import { getNomenclature } from '@/app/features/Nomenclature/components/actions/getNomenclature';
import NomenclatureName from '@/app/features/Nomenclature/components/NomenclatureName';
import NomenclatureCodesTable from '@/app/features/NomenclatureCodesTable';

interface Nomenclature {
  nomenclatureId: string;
  name: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const nomenclature: Nomenclature = await getNomenclature(id);

  return (
    <MainLayout>
      <div className="flex h-full w-full flex-col gap-8">
        <h1 className="text-3xl font-bold">Редактирование Номенклатуры</h1>
        {/* Nomenclature */}
        <NomenclatureName nameValue={nomenclature.name} nomenclatureId={id} />

        <div className="flex h-full flex-row gap-8">
          <ConfigsTable nomenclatureId={id} />
          <NomenclatureCodesTable nomenclatureId={id} />
        </div>
      </div>
    </MainLayout>
  );
}
