'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '@/app/features/Modal';
import { UploadIcon, BinIcon } from '@/app/components/Icons';
import { uploadCodePacks } from './CodePacksTable/actions/uploadCodePacks';
import { useRouter } from 'next/navigation';

interface UploadCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomenclatureId: string;
}

export default function UploadCodesModal({
  isOpen,
  onClose,
  nomenclatureId,
}: UploadCodesModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    }
    // Clear the file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const uploadFiles = uploadCodePacks.bind(null, nomenclatureId);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('files', file));
      await uploadFiles(formData);
      setSelectedFiles([]);
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Загрузить Коды">
      <form className="space-y-4" onSubmit={handleUpload}>
        {/* Drag-and-Drop Area */}
        <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50">
          <UploadIcon className="h-12 w-12 text-gray-500" />
          <p className="mt-2 text-sm text-gray-500">
            Перетащите файл сюда или нажмите, чтобы выбрать
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
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Загрузить
        </button>
      </form>
    </Modal>
  );
}
