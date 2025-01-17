'use client';

import { Modal } from '@/app/features/Modal';
import { useState } from 'react';

export default function ConfigCreateModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newConfig: { label: string; value: string }) => void;
}) {
  const [packCount, setPackCount] = useState('');
  const [palletCount, setPalletCount] = useState('');

  const handleCreate = async () => {
    const formattedConfig = {
      label: `1-${packCount}-${palletCount}`,
      value: {
        // convert to number
        pieceInPack: Number(packCount),
        packInPallet: Number(palletCount),
      },
    };
    onCreate(formattedConfig);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Config">
      <div className="space-y-4">
        <div>
          <label>Кол-во в пачке</label>
          <input
            type="number"
            value={packCount}
            onChange={e => setPackCount(e.target.value)}
            className="w-full rounded-lg border p-2"
          />
        </div>
        <div>
          <label>Кол-во в паллете</label>
          <input
            type="number"
            value={palletCount}
            onChange={e => setPalletCount(e.target.value)}
            className="w-full rounded-lg border p-2"
          />
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Create
        </button>
      </div>
    </Modal>
  );
}
