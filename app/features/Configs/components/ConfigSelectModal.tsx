import { Modal } from '@/app/features/Modal';
import { useEffect, useState } from 'react';
import ConfigCreateModal from './ConfigCreateModal';
import CreatableSelect from 'react-select/creatable';

interface Option {
  label: string;
  value: {
    packCount: number;
    palletCount: number;
  };
}

export async function fetchConfigurations() {
  const res = await fetch(`/api/configurations`, {
    cache: 'no-store',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch configurations');
  }

  return res.json();
}

export default function ConfigSelectModal({
  isOpen,
  onClose,
  onAdd,
  nomenclatureId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (configs: Option[]) => void;
  nomenclatureId: string;
}) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]); // Track selected options
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Manage create modal visibility

  useEffect(() => {
    if (isOpen) {
      fetchConfigurations()
        .then(data => {
          setOptions(data);
        })
        .catch(error => {
          console.error('Failed to fetch configurations:', error);
        });
    }
  }, [isOpen]);

  const handleChange = (newValue: Option[]) => {
    setSelectedOptions(newValue);
  };

  const handleAdd = () => {
    onAdd(selectedOptions);
    setSelectedOptions([]); // Clear selected options after adding
    onClose();
  };

  const handleCreate = (newConfig: Option) => {
    console.log(newConfig);
    // Add new config to options and select it
    setOptions(prevOptions => [...prevOptions, newConfig]);
    setSelectedOptions(prevSelected => [...prevSelected, newConfig]);
    setCreateModalOpen(false); // Close create modal
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
