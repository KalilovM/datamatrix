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
    id: string;
    nomenclatureId: string;
    pieceInPack: number;
    packInPallet: number;
  }[];
}

export default function AggregationForm({ options }: AggregationFormProps) {
  const [selectedConfiguration, setSelectedConfiguration] = useState<{
    id: string;
    nomenclatureId: string;
    pieceInPack: number;
    packInPallet: number;
  } | null>(null);

  const [packValues, setPackValues] = useState<string[]>([]);
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState<number | null>(null);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);

  const packRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (selectedConfiguration) {
      setPackValues(Array(selectedConfiguration.pieceInPack).fill(""));
      packRefs.current = [];
      setUniqueCode(null);
    }
  }, [selectedConfiguration]);

  // ✅ Memoized function to submit data when all fields are filled
  const submitPackData = useCallback(async () => {
    try {
      const res = await fetch("/api/aggregations/generate-pack-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packCodes: packValues,
          configurationId: selectedConfiguration?.id,
          nomenclatureId: selectedConfiguration?.nomenclatureId,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при генерации кода");

      const data = await res.json();
      setUniqueCode(data.uniqueCode);
      toast.success("Уникальный код успешно создан!");
    } catch (error) {
      toast.error("Ошибка при отправке данных на сервер");
      console.error("Ошибка при отправке данных на сервер", error);
    }
  }, [packValues]);

  // ✅ Effect to detect when all inputs are filled and trigger submission
  useEffect(() => {
    if (packValues.length > 0 && packValues.every((val) => val !== "")) {
      toast.success("Все поля заполнены, отправляем данные...");
      submitPackData();
    }
  }, [packValues, submitPackData]); // Runs when `packValues` changes

  // ✅ Now `focusNextInput` only handles focusing
  const focusNextInput = useCallback(
    (currentIndex: number) => {
      const nextIndex = packValues.findIndex(
        (val, i) => val === "" && i > currentIndex,
      );

      console.log("Updated packValues:", packValues);
      console.log("Next index to focus:", nextIndex);

      if (nextIndex !== -1 && packRefs.current[nextIndex]) {
        packRefs.current[nextIndex]?.focus();
      }
    },
    [packValues],
  );

  useEffect(() => {
    if (lastUpdatedIndex !== null) {
      focusNextInput(lastUpdatedIndex);
    }
  }, [lastUpdatedIndex, focusNextInput]);

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

      setLastUpdatedIndex(index);
      return true;
    } catch (error) {
      toast.error("Ошибка проверки кода");
      console.error("Ошибка проверки кода", error);
      return false;
    }
  };

  const handlePackInputClear = (index: number) => {
    setPackValues((prev) => {
      const newValues = [...prev];
      newValues[index] = "";
      return newValues;
    });
    packRefs.current[index]?.focus();
  };

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
        <div className="w-1/2">
          <div className="table-layout">
            <div className="table-header flex justify-between items-center">
              <p className="table-header-title">Пачки</p>
            </div>
            <div className="table-rows-layout">{renderPackInputs()}</div>
            {/* Display unique code if available */}
            {uniqueCode && (
              <div className="p-4 mt-4 border rounded bg-gray-100 text-center">
                <p className="text-lg font-semibold">Уникальный код:</p>
                <p className="text-2xl text-blue-600 font-bold">{uniqueCode}</p>
              </div>
            )}
          </div>
        </div>
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
