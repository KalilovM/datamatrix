import NomenclatureEdit from '@/app/features/NomenclatureEdit';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <NomenclatureEdit id={id} />;
}
