'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import { EditIcon, BinIcon, SearchIcon } from '@/app/components/Icons';
import { Modal } from '@/app/features/Modal';
import { Nomenclature } from '@prisma/client';

interface NomenclatureWithCodes extends Nomenclature {
  code_count: number;
}

interface NomenclatureTableProps {
  nomenclatures: NomenclatureWithCodes[];
}

export default function NomenclatureTable({
  nomenclatures,
}: NomenclatureTableProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nomenclatureName, setNomenclatureName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateNomenclature = async () => {
    if (!nomenclatureName.trim()) return;
    setIsLoading(true);

    try {
      const newNomenclature = await fetch('/api/nomenclature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nomenclatureName }),
      }).then(res => res.json());
      console.log('new nomenclature', newNomenclature);
      setModalOpen(false);
      setNomenclatureName('');
      router.push(`/nomenclature/edit/${newNomenclature.id}`);
    } catch (error) {
      console.error('Error creating nomenclature:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      {/* Table Head */}
      <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="flex h-full items-center justify-between">
          <div className="text-xl font-bold leading-9">Номенклатуры</div>
          <div className="flex flex-row gap-3">
            {/* Table search field */}
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Поиск..."
                className="ml-2 w-full border-none text-gray-700 outline-none focus:ring-0"
              />
              <SearchIcon className="h-5 w-5 cursor-pointer text-gray-500" />
            </div>
            {/* Create Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
            >
              Создать
            </button>
          </div>
        </div>
      </div>
      {/* Table Body */}
      <div className="flex flex-col divide-y divide-gray-200 overflow-y-auto">
        {/* Table Heading */}
        <div className="flex items-center bg-gray-100 px-8 py-3 font-medium text-gray-700">
          <div className="flex-1 text-left">Наименование</div>
          <div className="flex w-[200px] flex-shrink-0 justify-start gap-8">
            <span>Коды DataMatrix</span>
          </div>
        </div>
        {/* Table Rows */}
        {nomenclatures.map(nomenclature => (
          <div
            key={nomenclature.id}
            className="flex items-center px-8 py-4 hover:bg-gray-100"
          >
            {/* Name */}
            <div className="flex-1 text-left text-gray-900">
              {nomenclature.name}
            </div>
            {/* Codes Count and Actions */}
            <div className="flex w-[200px] flex-shrink-0 justify-between gap-8">
              <span className="text-gray-600">{nomenclature.code_count}</span>
              <div className="flex gap-2">
                <Button
                  icon={<EditIcon className="size-5" />}
                  className="bg-blue-600 px-2.5 py-2.5 text-white hover:bg-blue-700"
                />
                <Button
                  icon={<BinIcon className="size-5" />}
                  className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Nomenclature Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Создать номенклатуру"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Наименование
          </label>
          <input
            type="text"
            value={nomenclatureName}
            onChange={e => setNomenclatureName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
          <button
            onClick={handleCreateNomenclature}
            disabled={isLoading}
            className={`mt-4 w-full rounded-md px-4 py-2 text-white ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
