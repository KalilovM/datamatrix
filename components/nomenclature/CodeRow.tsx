"use client";

import React, { useState } from "react";
import { BinIcon } from "../Icons";
import { toast } from "react-toastify";

import { FileData } from "./NomenclatureEditForm";

interface CodeRowProps {
  file: FileData;
  onDelete?: (file: FileData) => void;
}

const CodeRow: React.FC<CodeRowProps> = ({ file, onDelete }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(file);
    } else {
      toast.success("Код удален");
    }
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  return (
    <div className="mb-2">
      <div className="flex cursor-pointer items-center justify-between px-8 py-4">
        <div className="flex-1">{file.fileName}</div>
        <div className="flex shrink-0 flex-row items-center">
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 px-2.5 py-2.5 text-white rounded-md"
          >
            <BinIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-md bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Подтверждение удаления</h2>
            <p className="mb-6">
              Вы уверены, что хотите удалить код &ldquo;{file.fileName}&rdquo;?
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
    </div>
  );
};

export default CodeRow;
