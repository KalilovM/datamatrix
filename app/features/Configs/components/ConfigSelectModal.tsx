'use client';

import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Modal } from '@/app/features/Modal';
import ConfigCreateModal from './ConfigCreateModal';

interface Option {
  label: string;
  value: {
    packCount: number;
    palletCount: number;
  };
}

export default function ConfigSelectModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (configs: Option[]) => void;
}) {
  const [options, setOptions] = useState<Option[]>([
    {
      value: {
        packCount: 5,
        palletCount: 100,
      },
      label: '1-5-100',
    },
    {
      value: {
        packCount: 6,
        palletCount: 200,
      },
      label: '1-6-200',
    },
    {
      value: {
        packCount: 8,
        palletCount: 300,
      },
      label: '1-8-300',
    },
  ]);
  const [selectedConfigs, setSelectedConfigs] = useState<Option[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateOption = (label: string) => {
    setCreateModalOpen(true);
  };

  const handleNewConfig = (newConfig: { label: string; value: string }) => {
    console.log(newConfig);
    const newOption = { value: newConfig.value, label: newConfig.label };
    setOptions(prev => [...prev, newOption]);
    setSelectedConfigs(prev => [...prev, newOption]);
  };

  const handleAdd = () => {
    onAdd(selectedConfigs);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Add Configs">
        <div className="space-y-4">
          <CreatableSelect
            isMulti
            isClearable
            options={options}
            value={selectedConfigs}
            onChange={newValue => setSelectedConfigs(newValue as Option[])}
            onCreateOption={handleCreateOption} // Opens the modal to create a new config
          />
          <button
            onClick={handleAdd}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            Add Selected Configs
          </button>
        </div>
      </Modal>

      {/* Config Create Modal */}
      <ConfigCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={newConfig => {
          handleNewConfig(newConfig);
          setCreateModalOpen(false); // Close the modal after creation
        }}
      />
    </>
  );
}
