"use client";

import React, {
  useState,
  DragEvent,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { UploadIcon, BinIcon, CloseIcon } from "../Icons";
import { toast } from "react-toastify";

interface CodesUploadModalProps {
  onClose: () => void;
  onAdd: (file: { fileName: string; content: string }) => void;
}

const CodesUploadModal: React.FC<CodesUploadModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [error, setError] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Пожалуйста, выберите CSV файл для загрузки.");
      return;
    }

    // Check that every file is a CSV.
    const invalidFile = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith(".csv"),
    );
    if (invalidFile) {
      toast.error(`Файл ${invalidFile.name} не является CSV.`);
      return;
    }

    // Process each selected file.
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          onAdd({ fileName: file.name, content });
          toast.success(`Файл ${file.name} успешно загружен!`);
        }
      };
      reader.onerror = () => {
        setError("Ошибка чтения файла.");
        toast.error("Ошибка чтения файла " + file.name);
      };
      reader.readAsText(file);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/2 relative">
        {/* X mark icon to close the modal */}
        <button
          className="absolute top-2 right-5 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <form className="space-y-4 pt-4" onSubmit={handleUpload}>
          {/* Drag-and-Drop Area */}
          <div
            className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadIcon className="h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm text-gray-500">
              Перетащите CSV файл сюда или нажмите, чтобы выбрать
            </p>
            <input
              type="file"
              name="files"
              accept=".csv"
              multiple
              className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* File List */}
          {selectedFiles.length > 0 && (
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-2"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <BinIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={selectedFiles.length === 0}
            className={`mt-4 w-full rounded-md px-4 py-2 text-white ${
              selectedFiles.length === 0
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Загрузить
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodesUploadModal;
