'use client';

import { Modal } from '@/app/features/Modal';
import { useState } from 'react';
import ConfigCreateModal from './ConfigCreateModal';
import CreatableSelect from 'react-select/creatable';
import { useRouter } from 'next/navigation';

interface Option {
  label: string;
  value: {
    packCount: number;
    palletCount: number;
  };
}

export default function ConfigSelectModal({
  isOpen,
  configOptions,
  nomenclatureId,
  onClose,
}: {
  isOpen: boolean;
  configOptions: Option[];
  onClose: () => void;
  nomenclatureId: string;
}) {
  const [options, setOptions] = useState<Option[]>(configOptions);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]); // Track selected options
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Manage create modal visibility

  const router = useRouter();

  const handleChange = (newValue: Option[]) => {
    setSelectedOptions(newValue);
  };

  const handleAdd = async () => {
    try {
      console.log(selectedOptions);
      const response = await fetch(
        `/api/nomenclature/${nomenclatureId}/configs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedOptions),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to add configurations');
      }
      setSelectedOptions([]);
      onClose();
      router.refresh();
    } catch (error: unknown) {
      console.error('Failed to add configurations', error);
    }
  };

  const handleCreate = (newConfig: Option) => {
    console.log(configOptions);
    setOptions(prevOptions => [...prevOptions, newConfig]);
    setSelectedOptions(prevSelected => [...prevSelected, newConfig]);
    setCreateModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Добавление конфигурации">
        <div className="space-y-4">
          <CreatableSelect
            isMulti
            isClearable
            options={options} // Fetched options from the server
            placeholder="Выберите или создайте конфигурацию"
            onChange={handleChange}
            onCreateOption={() => setCreateModalOpen(true)} // Open the create modal
          />
          <button
            onClick={handleAdd}
            disabled={selectedOptions.length === 0}
            className={`mt-4 rounded-md bg-blue-600 px-4 py-2 text-white ${
              selectedOptions.length === 0
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Добавить
          </button>
        </div>
      </Modal>

      {/* Config Create Modal */}
      <ConfigCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate} // Pass handleCreate to update options and selected configs
        nomenclatureId={nomenclatureId}
      />
    </>
  );
}
