"use client";

import React, { useState } from "react";
import ConfigurationsUploadModal from "./ConfigurationsUploadModal";
import CodesUploadModal from "./CodesUploadModal";
import ConfigurationRow, { OptionType } from "./ConfigurationRow";

// For codes, we still use file data.
interface FileData {
  fileName: string;
  content: string;
}

const NomenclatureForm: React.FC = () => {
  // Configurations are stored as OptionType objects.
  const [configurations, setConfigurations] = useState<OptionType[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Codes remain as before.
  const [codes, setCodes] = useState<FileData[]>([]);
  const [isCodesModalOpen, setIsCodesModalOpen] = useState<boolean>(false);

  const handleAddConfiguration = (option: OptionType[]) => {
    setConfigurations((prev) => [...prev, ...option]);
    setIsConfigModalOpen(false);
  };

  // Handler to remove a configuration option.
  const handleDeleteConfiguration = (optionToDelete: OptionType) => {
    setConfigurations((prev) =>
      prev.filter(
        (option) =>
          !(
            option.value.peaceInPack === optionToDelete.value.peaceInPack &&
            option.value.packInPallet === optionToDelete.value.packInPallet
          ),
      ),
    );
  };

  // Handler to update a configuration option.
  const handleEditConfiguration = (
    oldOption: OptionType,
    updatedOption: OptionType,
  ) => {
    setConfigurations((prev) =>
      prev.map((option) => {
        if (
          option.value.peaceInPack === oldOption.value.peaceInPack &&
          option.value.packInPallet === oldOption.value.packInPallet
        ) {
          return updatedOption;
        }
        return option;
      }),
    );
  };

  // Handler to add a new code file.
  const handleAddCode = (file: FileData) => {
    setCodes((prev) => [...prev, file]);
    setIsCodesModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <h1 className="leading-6 text-xl font-bold">Новая номенклатура</h1>
      {/* Nomenclature Fields */}
      <form className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-between items-center">
        <div className="w-1/2 flex flex-col">
          <label htmlFor="name" className="block">
            Наименование
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full rounded-lg border px-3 py-2 text-gray-700"
          />
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
          >
            Сохранить
          </button>
        </div>
      </form>

      <div className="flex flex-row w-full gap-4 h-full">
        {/* Configurations Section */}
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Конфигурации</p>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(true)}
                className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
              >
                Создать
              </button>
            </div>
            <div className="table-rows-layout">
              {configurations.length === 0 ? (
                <p className="p-4">Нет конфигураций</p>
              ) : (
                configurations.map((option) => (
                  <ConfigurationRow
                    key={`${option.value.peaceInPack}-${option.value.packInPallet}`}
                    option={option}
                    onDelete={handleDeleteConfiguration}
                    onEdit={handleEditConfiguration}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Codes Section */}
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Коды datamatrix</p>
              <button
                type="button"
                onClick={() => setIsCodesModalOpen(true)}
                className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
              >
                Загрузить
              </button>
            </div>
            <div className="p-4">
              {codes.length === 0 ? (
                <p>Нет кодов</p>
              ) : (
                <ul>
                  {codes.map((file, index) => (
                    <li key={index} className="mb-2">
                      {file.fileName}
                      {/* Hidden inputs for form submission */}
                      <input
                        type="hidden"
                        name={`codes[${index}][fileName]`}
                        value={file.fileName}
                      />
                      <input
                        type="hidden"
                        name={`codes[${index}][content]`}
                        value={file.content}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isConfigModalOpen && (
        <ConfigurationsUploadModal
          onClose={() => setIsConfigModalOpen(false)}
          onAdd={handleAddConfiguration}
        />
      )}
      {isCodesModalOpen && (
        <CodesUploadModal
          onClose={() => setIsCodesModalOpen(false)}
          onAdd={handleAddCode}
        />
      )}
    </div>
  );
};

export default NomenclatureForm;
