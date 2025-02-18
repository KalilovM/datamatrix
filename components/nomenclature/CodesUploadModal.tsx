"use client";

import React, { useState, DragEvent } from "react";

interface CodesUploadModalProps {
  onClose: () => void;
  onAdd: (file: { fileName: string; content: string }) => void;
}

const CodesUploadModal: React.FC<CodesUploadModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [error, setError] = useState<string>("");

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          onAdd({ fileName: file.name, content });
        }
      };
      reader.onerror = () => {
        setError("Ошибка чтения файла.");
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="bg-white p-8 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">
          Загрузка кодов (перетащите файл)
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodesUploadModal;
