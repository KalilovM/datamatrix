import Button from '@/app/components/Button';
import { BinIcon } from '@/app/components/Icons';
import { getCodePacks } from './CodePacksTable/actions/getCodePacks';

interface CodePack {
  id: string;
  name: string; // File name
  createdAt: string; // Upload date
  codesCount: number; // Number of codes in the file
}

export default async function NomenclatureCodesTable({
  nomenclatureId,
}: {
  nomenclatureId: string;
}) {
  const codePacks: CodePack[] = await getCodePacks(nomenclatureId);

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="flex h-full items-center justify-between">
          <div className="text-xl font-bold leading-9">Коды Номенклатуры</div>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            Добавить
          </button>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-gray-200 overflow-y-auto">
        <div className="flex items-center bg-gray-100 px-8 py-3 font-medium text-gray-700">
          <div className="w-1/3 text-left">Название файла</div>
          <div className="w-1/3 text-left">Дата загрузки</div>
          <div className="w-1/3 text-left">Количество кодов</div>
        </div>
        {codePacks.map(codePack => (
          <div
            key={codePack.id}
            className="flex items-center px-8 py-4 hover:bg-gray-100"
          >
            <div className="w-1/3 text-left text-gray-900">{codePack.name}</div>
            <div className="w-1/3 text-left text-gray-900">
              {new Date(codePack.createdAt).toLocaleDateString()}
            </div>
            <div className="flex w-1/3 items-center justify-between">
              <span className="text-gray-600">{codePack._count.codes}</span>
              <Button
                icon={<BinIcon className="size-5" />}
                className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
                type="button"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
