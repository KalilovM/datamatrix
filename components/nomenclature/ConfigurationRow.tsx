"use client";

import React, { useState } from "react";
import { BinIcon, EditIcon } from "../Icons";
import { toast } from "react-toastify";

export interface OptionValue {
  peaceInPack: number;
  packInPallet: number;
}

export interface OptionType {
  label: string;
  value: OptionValue;
}

interface ConfigurationRowProps {
  option: OptionType;
  onDelete?: (option: OptionType) => void;
  onEdit?: (oldOption: OptionType, updatedOption: OptionType) => void;
}

const ConfigurationRow: React.FC<ConfigurationRowProps> = ({
  option,
  onDelete,
  onEdit,
}) => {
  // Separate states for edit and delete modals.
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Local state for edit modal input values.
  const [editPeace, setEditPeace] = useState<number>(option.value.peaceInPack);
  const [editPallet, setEditPallet] = useState<number>(
    option.value.packInPallet,
  );

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Pre-fill with current values.
    setEditPeace(option.value.peaceInPack);
    setEditPallet(option.value.packInPallet);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(option);
    } else {
      toast.success("Конфигурация удалена");
    }
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = () => {
    const updatedOption: OptionType = {
      label: `1-${editPeace}-${editPallet}`,
      value: { peaceInPack: editPeace, packInPallet: editPallet },
    };
    if (onEdit) {
      onEdit(option, updatedOption);
    } else {
      toast.success("Конфигурация обновлена");
    }
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="flex cursor-pointer items-center justify-between px-8 py-4">
        <div className="flex-1">{option.label}</div>
        <div className="flex shrink-0 flex-row items-center">
          <button
            onClick={handleEdit}
            className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md"
          >
            <EditIcon className="size-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 px-2.5 py-2.5 text-white rounded-md"
          >
            <BinIcon className="size-5" />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-md bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              Редактирование конфигурации
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1">
                  Количество в упаковке (peace in pack):
                </label>
                <input
                  type="number"
                  value={editPeace}
                  onChange={(e) => setEditPeace(Number(e.target.value))}
                  className="w-full border rounded-sm px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">
                  Количество в поддоне (pack in pallet):
                </label>
                <input
                  type="number"
                  value={editPallet}
                  onChange={(e) => setEditPallet(Number(e.target.value))}
                  className="w-full border rounded-sm px-2 py-1"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-md bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Подтверждение удаления</h2>
            <p className="mb-6">
              Вы уверены, что хотите удалить конфигурацию &ldquo;
              {option.label}&rdquo;?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigurationRow;
