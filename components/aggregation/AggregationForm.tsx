"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [selectedConfiguration, setSelectedConfiguration] = useState<{
    pieceInPack: number;
    packInPallet: number;
  } | null>(null);

  const [packValues, setPackValues] = useState<string[]>([]);
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState<number | null>(null);

  // Refs for each PackInput for focus management.
  const packRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Reset pack values when configuration changes.
  useEffect(() => {
    if (selectedConfiguration) {
      setPackValues(Array(selectedConfiguration.pieceInPack).fill(""));
      packRefs.current = [];
    }
  }, [selectedConfiguration]);

  // Find and focus the next empty input
  const focusNextInput = useCallback(
    (currentIndex: number) => {
      const nextIndex = packValues.findIndex(
        (val, i) => val === "" && i > currentIndex,
      );

      console.log("Updated packValues:", packValues);
      console.log("Next index to focus:", nextIndex);

      if (nextIndex !== -1 && packRefs.current[nextIndex]) {
        packRefs.current[nextIndex]?.focus();
      } else if (nextIndex === -1) {
        toast.success("Все поля заполнены, переходим на следующую страницу");
      }
    },
    [packValues], // Ensures it updates when `packValues` changes
  );

  // Effect to focus the next input after a state update
  useEffect(() => {
    if (lastUpdatedIndex !== null) {
      focusNextInput(lastUpdatedIndex);
    }
  }, [lastUpdatedIndex, focusNextInput]);

  // Validate a code by sending a request to the backend.
  const validateCode = async (
    index: number,
    value: string,
  ): Promise<boolean> => {
    try {
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

      if (packValues.includes(value)) {
        toast.error("Код уже в списке");
        return false;
      }

      setPackValues((prev) => {
        const newValues = [...prev];
        newValues[index] = value;
        return newValues;
      });

      setLastUpdatedIndex(index); // Update index to trigger focus

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
