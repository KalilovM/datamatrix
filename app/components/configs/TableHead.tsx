'use client';
import ConfigSelectModal from '@/app/features/Configs/components/ConfigSelectModal';
import TableSearchField from '../TableSearchField';
import { Config } from '@/app/features/Configs/components/ConfigTable';
import { useState } from 'react';

interface TableHeadProps {
  title: string;
  nomenclatureId: string;
  options: Config[];
}

export default function TableHead({
  title,
  nomenclatureId,
  options,
}: TableHeadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
      <div className="flex h-full items-center justify-between">
        <div className="text-xl font-bold leading-9">{title}</div>
        <div className="flex flex-row gap-3">
          {/* Table search field */}
          <TableSearchField />
          {/* Create Button */}
          <button
            className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Создать
          </button>
          {/* Modal */}
          <ConfigSelectModal
            onClose={() => setIsModalOpen(false)}
            nomenclatureId={nomenclatureId}
            isOpen={isModalOpen}
            configOptions={options}
          />
        </div>
      </div>
    </div>
  );
}
