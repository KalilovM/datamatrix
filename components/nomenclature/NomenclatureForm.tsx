"use client";

import React, { useState, FormEvent } from "react";
import ConfigurationsUploadModal from "./ConfigurationsUploadModal";
import CodesUploadModal from "./CodesUploadModal";
import ConfigurationRow, { OptionType } from "./ConfigurationRow";
import CodeRow from "./CodeRow";

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

  // Handler to add new configuration(s) (here expecting an array).
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

  const handleDeleteCode = (fileToDelete: FileData) => {
    setCodes((prev) => prev.filter((file) => file !== fileToDelete));
  };

  // Handle form submission and send data to the API.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Append configurations as a JSON string.
    // You can choose to send the entire object (including the label)
    // or just the value part. Here, we send the value.
    formData.append(
      "configurations",
      JSON.stringify(configurations.map((option) => option.value)),
    );

    // Append codes as a JSON string.
    formData.append("codes", JSON.stringify(codes));

    try {
      // Debug: log formData entries (note that JSON strings will be visible)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const res = await fetch("/api/nomenclature", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Номенклатура успешно сохранена!");
      } else {
        alert("Ошибка при сохранении номенклатуры.");
      }
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при сохранении.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <form className="gap-4 flex flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <h1 className="leading-6 text-xl font-bold">Новая номенклатура</h1>
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
        </div>
        {/* Nomenclature Fields */}
        <div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-between items-center gap-4">
          <div className="flex flex-row w-full gap-4">
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
            <div className="w-1/2 flex flex-col">
              <label htmlFor="modelArticle" className="block">
                Модель/Артикул
              </label>
              <input
                name="modelArticle"
                type="text"
                required
                className="w-full rounded-lg border px-3 py-2 text-gray-700"
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-4">
            <div className="w-1/2 flex flex-col">
              <label htmlFor="color" className="block">
                Цвет
              </label>
              <input
                name="color"
                type="text"
                required
                className="w-full rounded-lg border px-3 py-2 text-gray-700"
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <label htmlFor="size" className="block">
                Размер
              </label>
              <input
                name="size"
                type="text"
                required
                className="w-full rounded-lg border px-3 py-2 text-gray-700"
              />
            </div>
          </div>
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
                <p className="px-8 py-4">Нет конфигураций</p>
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
            <div className="table-rows-layout">
              {codes.length === 0 ? (
                <p className="px-8 py-4">Нет кодов</p>
              ) : (
                <ul>
                  {codes.map((file, index) => (
                    <li key={index} className="mb-2">
                      <CodeRow file={file} onDelete={handleDeleteCode} />
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
