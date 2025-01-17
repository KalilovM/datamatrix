import Button from '@/app/components/Button';
import HeadingRow from '@/app/components/configs/HeadingRow';
import { EditIcon, BinIcon } from '@/app/components/Icons';
import { getConfigs, getConfigOptions } from '../actions/getConfigs';
import TableLayout from '@/app/components/configs/TableLauout';

export interface Config {
  id: string;
  pieceInPack: number;
  packInPallet: number;
}

export default async function ConfigsTable({
  nomenclatureId,
}: {
  nomenclatureId: string;
}) {
  const configs: Config[] = await getConfigs(nomenclatureId);
  const configOptions = await getConfigOptions(nomenclatureId);

  const handleEdit = (id: string) => {
    console.log(`Edit config with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete config with ID: ${id}`);
  };

  return (
    <TableLayout
      title="Конфигурации"
      headingRow={<HeadingRow />}
      nomenclatureId={nomenclatureId}
      configOptions={configOptions}
    >
      {configs.map((config, index) => (
        <div
          key={`config-${config.pieceInPack}-${config.packInPallet}-${index}`}
          className="flex items-center px-8 py-4 hover:bg-gray-100"
        >
          <div className="w-1/3 text-left text-gray-900">
            {config.pieceInPack}
          </div>
          <div className="w-1/3 text-left text-gray-900">
            {config.packInPallet}
          </div>
          <div className="flex w-1/3 justify-end gap-2">
            <Button
              icon={<EditIcon className="size-5" />}
              className="bg-blue-600 px-2.5 py-2.5 text-white hover:bg-blue-700"
              type="button"
            />
            <Button
              icon={<BinIcon className="size-5" />}
              className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
              type="button"
            />
          </div>
        </div>
      ))}
    </TableLayout>
  );
}
