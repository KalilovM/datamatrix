'use client';

import Button from '@/app/components/Button';
import { EditIcon, BinIcon } from '@/app/components/Icons';

export default function ConfigsTable({ configs, onAdd }) {
  const handleEdit = id => {
    console.log(`Edit config with ID: ${id}`);
  };

  const handleDelete = id => {
    console.log(`Delete config with ID: ${id}`);
  };

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="flex h-full items-center justify-between">
          <div className="text-xl font-bold leading-9">Configs</div>
          <button
            onClick={onAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-gray-200 overflow-y-auto">
        <div className="flex items-center bg-gray-100 px-8 py-3 font-medium text-gray-700">
          <div className="w-1/3 text-left">Кол-во в пачке</div>
          <div className="w-1/3 text-left">Кол-во в паллете</div>
          <div className="w-1/3 text-right">Действия</div>
        </div>
        {configs.map(config => (
          <div
            key={config.id}
            className="flex items-center px-8 py-4 hover:bg-gray-100"
          >
            <div className="w-1/3 text-left text-gray-900">
              {config.packCount}
            </div>
            <div className="w-1/3 text-left text-gray-900">
              {config.palletCount}
            </div>
            <div className="flex w-1/3 justify-end gap-2">
              <Button
                icon={<EditIcon className="size-5" />}
                onClick={() => handleEdit(config.id)}
                className="bg-blue-600 px-2.5 py-2.5 text-white hover:bg-blue-700"
              />
              <Button
                icon={<BinIcon className="size-5" />}
                onClick={() => handleDelete(config.id)}
                className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
