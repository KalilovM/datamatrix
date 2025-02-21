"use client";

import React, { useState, useRef, useEffect } from "react";
import AggregationSelectors from "./AggregationSelectors";
import PackInput from "./PackInput";
import { toast } from "react-toastify";

interface AggregationFormProps {
  options: NomenclatureOption[] | null;
}

export interface NomenclatureOption {
  name: string | null;
  id: string;
  configurations: {
    pieceInPack: number;
    packInPallet: number;
  }[];
}

export default function AggregationForm({ options }: AggregationFormProps) {
  // Store the selected configuration from AggregationSelectors.
  const [selectedConfiguration, setSelectedConfiguration] = useState<{
    pieceInPack: number;
    packInPallet: number;
  } | null>(null);

  // Array to hold the current values for each pack input.
  const [packValues, setPackValues] = useState<string[]>([]);

  // Refs for each PackInput for focus management.
  const packRefs = useRef<Array<HTMLInputElement | null>>([]);

  // When configuration changes, reset the pack values and refs.
  useEffect(() => {
    if (selectedConfiguration) {
      setPackValues(Array(selectedConfiguration.pieceInPack).fill(""));
      packRefs.current = [];
    }
  }, [selectedConfiguration]);

  // Validate a code by sending a request to the backend.
  const validateCode = async (
    index: number,
    value: string,
  ): Promise<boolean> => {
    try {
      // Check via API if the code exists in the database.
      const res = await fetch("/api/codes/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      const data = await res.json();
      if (!data.exists) {
        toast.error("Код не найден в БД");
        return false;
      }
      // Prevent duplicate codes in the current list.
      if (packValues.includes(value)) {
        toast.error("Код уже в списке");
        return false;
      }
      // Code is valid—update the pack values.
      setPackValues((prev) => {
        const newValues = [...prev];
        newValues[index] = value;
        return newValues;
      });
      focusNextInput(index);
      return true;
    } catch (error) {
      toast.error("Ошибка проверки кода");
      console.error("Ошибка проверки кода", error);
      return false;
    }
  };

  // Clear a specific pack input.
  const handlePackInputClear = (index: number) => {
    setPackValues((prev) => {
      const newValues = [...prev];
      newValues[index] = "";
      return newValues;
    });
    packRefs.current[index]?.focus();
  };

  // Find and focus the next empty input. If all are filled, trigger pagination.
  const focusNextInput = (currentIndex: number) => {
    const nextIndex = packValues.findIndex(
      (val, i) => val === "" && i > currentIndex,
    );
    console.log("indexes", packValues);
    console.log("nextIndex", nextIndex);
    if (nextIndex !== -1 && packRefs.current[nextIndex]) {
      packRefs.current[nextIndex]?.focus();
    } else if (nextIndex === -1) {
      toast.success("Все поля заполнены, переходим на следующую страницу");
    }
  };

  // Render the list of PackInput components.
  const renderPackInputs = () => {
    if (!selectedConfiguration) {
      return (
        <p className="px-8 py-3">Выберите конфигурацию для отображения пачек</p>
      );
    }
    return packValues.map((value, index) => (
      <PackInput
        key={index}
        index={index}
        value={value}
        onValidScan={validateCode}
        onClear={() => handlePackInputClear(index)}
        inputRef={(el) => (packRefs.current[index] = el)}
      />
    ));
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <AggregationSelectors
        options={options}
        onConfigurationSelect={setSelectedConfiguration}
      />
      <div className="flex flex-row w-full gap-4 h-full">
        {/* Пачки Section */}
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Пачки</p>
            </div>
            <div className="table-rows-layout">{renderPackInputs()}</div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (selectedConfiguration)
                    setPackValues(
                      Array(selectedConfiguration.pieceInPack).fill(""),
                    );
                }}
              >
                Очистить все
              </button>
            </div>
          </div>
        </div>
        {/* Паллеты Section */}
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Паллеты</p>
            </div>
            <div className="table-rows-layout">
              <p className="px-8 py-3">Здесь будут отображаться паллеты</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
