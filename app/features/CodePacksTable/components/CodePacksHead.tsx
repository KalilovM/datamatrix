'use client';
import { useState } from 'react';
import UploadCodesModal from '../../UploadCodesModal';

interface CodePacksHeadProps {
  nomenclatureId: string;
}

export default function CodePacksHead({ nomenclatureId }: CodePacksHeadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex h-full items-center justify-between">
      <div className="text-xl font-bold leading-9">Коды Номенклатуры</div>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        Добавить
      </button>
      <UploadCodesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nomenclatureId={nomenclatureId}
      />
    </div>
  );
}
