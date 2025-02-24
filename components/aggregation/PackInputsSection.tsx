import React, { useState, useRef, useEffect, useCallback } from "react";
import PackInput from "./PackInput";
import PaginationControls from "./PaginationControls";
import { toast } from "react-toastify";
import { Configuration } from "./defenitions";

interface PackInputsSectionProps {
  selectedConfiguration: Configuration | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PackInputsSection: React.FC<PackInputsSectionProps> = ({
  selectedConfiguration,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [packValues, setPackValues] = useState<string[]>([]);
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState<number | null>(null);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);
  const packRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Initialize pack inputs whenever the configuration changes
  useEffect(() => {
    if (selectedConfiguration) {
      setPackValues(Array(selectedConfiguration.pieceInPack).fill(""));
      packRefs.current = [];
      setUniqueCode(null);
    }
  }, [selectedConfiguration]);

  // Submit pack data when all fields are filled
  const submitPackData = useCallback(async () => {
    if (!selectedConfiguration) return;

    try {
      const res = await fetch("/api/aggregations/generate-pack-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packCodes: packValues,
          configurationId: selectedConfiguration.id,
          nomenclatureId: selectedConfiguration.nomenclatureId,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при генерации кода");

      const data = await res.json();
      setUniqueCode(data.value);
      toast.success("Уникальный код успешно создан!");
    } catch (error) {
      toast.error("Ошибка при отправке данных на сервер");
      console.error("Ошибка при отправке данных на сервер", error);
    }
  }, [packValues, selectedConfiguration]);

  // Effect to trigger submission when all pack inputs are filled
  useEffect(() => {
    if (packValues.length && packValues.every((val) => val !== "")) {
      toast.success("Все поля заполнены, отправляем данные...");
      submitPackData();
    }
  }, [packValues, submitPackData]);

  // Focus on the next empty input after a valid scan
  const focusNextInput = useCallback(
    (currentIndex: number) => {
      const nextIndex = packValues.findIndex(
        (val, i) => val === "" && i > currentIndex,
      );
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

  // Validate scanned code with the backend API
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
    <div className="table-layout flex flex-col h-full">
      <div className="table-header flex justify-between items-center">
        <p className="table-header-title">Пачки</p>
      </div>
      {uniqueCode && (
        <div className="p-4 border rounded bg-gray-100 flex flex-col justify-start text-start items-center">
          <p className="text-lg font-semibold">Уникальный код:</p>
          <p className="text-xl text-green-600 font-bold">{uniqueCode}</p>
        </div>
      )}
      <div className="table-rows-layout flex-1">{renderPackInputs()}</div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PackInputsSection;
