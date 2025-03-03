"use client";

import React, { useState, FormEvent } from "react";
import CreatableSelect from "react-select/creatable";

interface OptionValue {
  peaceInPack: number;
  packInPallet: number;
}

interface OptionType {
  label: string;
  value: OptionValue;
}

interface ConfigurationsUploadModalProps {
  onClose: () => void;
  onAdd: (options: OptionType[]) => void;
}

const ConfigurationsUploadModal: React.FC<ConfigurationsUploadModalProps> = ({
  onClose,
  onAdd,
}) => {
  // All created options are stored here.
  const [options, setOptions] = useState<OptionType[]>([]);
  // Currently selected options.
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  // State to control showing the custom option modal.
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // This function is called from the custom modal after the user enters the numbers.
  const handleCreateCustomOption = (
    peaceInPack: number,
    packInPallet: number,
  ) => {
    const newOption: OptionType = {
      label: `1-${peaceInPack}-${packInPallet}`,
      value: { peaceInPack, packInPallet },
    };
    // Add the new option to both our list of options and selected options.
    setOptions((prev) => [...prev, newOption]);
    setSelectedOptions((prev) => [...prev, newOption]);
    setIsCustomModalOpen(false);
  };

  const handleSelectChange = (value: any) => {
    // When the selection changes, update the state.
    setSelectedOptions(value || []);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Pass the selected options (with structured value) to the parent.
    onAdd(selectedOptions);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-8 rounded-lg w-1/2">
          <h2 className="text-xl font-bold mb-4">Загрузка конфигурации</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <CreatableSelect
              isMulti
              // Filter out options that have already been selected.
              options={options.filter(
                (opt) =>
                  !selectedOptions.some(
                    (sel) =>
                      sel.value.peaceInPack === opt.value.peaceInPack &&
                      sel.value.packInPallet === opt.value.packInPallet,
                  ),
              )}
              placeholder="Выберите конфигурации"
              noOptionsMessage={() =>
                "Нет доступных конфигураций. Добавьте новую"
              }
              value={selectedOptions}
              onChange={handleSelectChange}
              onCreateOption={() => setIsCustomModalOpen(true)}
              formatCreateLabel={() => "Создать новую конфигурацию"}
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
              >
                Загрузить
              </button>
            </div>
          </form>
        </div>
      </div>
      {isCustomModalOpen && (
        <CustomOptionModal
          onClose={() => setIsCustomModalOpen(false)}
          onCreate={handleCreateCustomOption}
        />
      )}
    </>
  );
};

interface CustomOptionModalProps {
  onClose: () => void;
  onCreate: (peaceInPack: number, packInPallet: number) => void;
}

const CustomOptionModal: React.FC<CustomOptionModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [peaceInPack, setPeaceInPack] = useState<number>(0);
  const [packInPallet, setPackInPallet] = useState<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onCreate(peaceInPack, packInPallet);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-lg font-bold mb-4">Новая конфигурация</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Количество в упаковке:</label>
            <input
              type="number"
              value={peaceInPack}
              onChange={(e) => setPeaceInPack(Number(e.target.value))}
              className="w-full border rounded-sm px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Количество в паллете:</label>
            <input
              type="number"
              value={packInPallet}
              onChange={(e) => setPackInPallet(Number(e.target.value))}
              className="w-full border rounded-sm px-2 py-1"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationsUploadModal;
