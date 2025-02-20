"use client";

import React, { useState, FormEvent } from "react";
import ConfigurationsUploadModal from "./ConfigurationsUploadModal";
import CodesUploadModal from "./CodesUploadModal";
import ConfigurationRow, { OptionType } from "./ConfigurationRow";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CodeRowEdit from "./CodeRowEdit";

interface FileData {
  id: string;
  name: string;
}

interface NomenclatureData {
  id: string;
  name: string;
  modelArticle: string;
  color: string;
  size: string;
  configurations: OptionType[];
  codes: FileData[];
}

const NomenclatureEditForm: React.FC<{ initialData: NomenclatureData }> = ({
  initialData,
}) => {
  const [name, setName] = useState(initialData.name);
  const [modelArticle, setModelArticle] = useState(initialData.modelArticle);
  const [color, setColor] = useState(initialData.color);
  const [size, setSize] = useState(initialData.size);

  const [configurations, setConfigurations] = useState<OptionType[]>(
    initialData.configurations,
  );
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  const [codes, setCodes] = useState<FileData[]>(initialData.codes);
  const [isCodesModalOpen, setIsCodesModalOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleAddConfiguration = (option: OptionType[]) => {
    setConfigurations((prev) => [...prev, ...option]);
    setIsConfigModalOpen(false);
  };

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

  const handleEditConfiguration = (
    oldOption: OptionType,
    updatedOption: OptionType,
  ) => {
    setConfigurations((prev) =>
      prev.map((option) =>
        option.value.peaceInPack === oldOption.value.peaceInPack &&
        option.value.packInPallet === oldOption.value.packInPallet
          ? updatedOption
          : option,
      ),
    );
  };

  const handleAddCode = (file: FileData) => {
    setCodes((prev) => [...prev, file]);
    setIsCodesModalOpen(false);
  };

  const handleDeleteCode = async (fileToDelete: FileData) => {
    setCodes((prev) => prev.filter((file) => file !== fileToDelete));
    const res = await fetch(`/api/nomenclature/codepack/${fileToDelete.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Произошла ошибка при удалении файла.");
    } else {
      toast.success("Файл успешно удален.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Append the id to know which nomenclature to update.
    formData.append("id", initialData.id);
    formData.append("name", name);
    formData.append("modelArticle", modelArticle);
    formData.append("color", color);
    formData.append("size", size);

    // Append configurations and codes as JSON strings.
    formData.append(
      "configurations",
      JSON.stringify(configurations.map((option) => option.value)),
    );
    formData.append("codes", JSON.stringify(codes));

    try {
      const res = await fetch("/api/nomenclature/edit", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Номенклатура успешно обновлена!");
        router.push("/nomenclature");
      } else {
        const data = await res.json();
        toast.error(data.error || "Произошла ошибка при обновлении.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Произошла ошибка при обновлении.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="leading-6 text-xl font-bold">
            Редактирование номенклатуры
          </h1>
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
        <div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
          <div className="flex flex-row w-full gap-4">
            <div className="w-1/2 flex flex-col">
              <label htmlFor="name" className="block">
                Наименование
              </label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={modelArticle}
                onChange={(e) => setModelArticle(e.target.value)}
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
                value={color}
                onChange={(e) => setColor(e.target.value)}
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
                value={size}
                onChange={(e) => setSize(e.target.value)}
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
                      <CodeRowEdit
                        file={file}
                        onDelete={() => handleDeleteCode(file)}
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

export default NomenclatureEditForm;
