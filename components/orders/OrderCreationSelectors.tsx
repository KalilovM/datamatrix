"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ICounteragentOption } from "@/app/orders/create/defenitions";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function OrderCreationSelectors({
  counteragentOptionsProps,
  onCodesFetched,
  handleDownloadCSV,
}: {
  counteragentOptionsProps: ICounteragentOption[];
  onCodesFetched: (codes: string[]) => void;
  handleDownloadCSV: () => void;
}) {
  const [counteragentOptions] = useState(
    counteragentOptionsProps.map((option) => ({
      label: option.name,
      value: option.id,
    })),
  );

  const [selectedCounteragent, setSelectedCounteragent] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCounteragentChange = (option: {
    label: string;
    value: string;
  }) => {
    setSelectedCounteragent(option);
  };

  const validateCode = async (code: string) => {
    if (!code) return;

    try {
      const response = await fetch("/api/orders/validate-generated-code", {
        method: "POST",
        body: JSON.stringify({ generatedCode: code }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        onCodesFetched([]);
      } else {
        toast.success("Коды успешно загружены!");
        onCodesFetched(data.linkedCodes.map((c: { value: string }) => c.value));
      }
    } catch {
      toast.error("Ошибка сервера. Попробуйте позже.");
      onCodesFetched([]);
    }
  };

  return (
    <div className="gap-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="leading-6 text-xl font-bold">Новый Заказ</h1>
        <button
          onClick={handleDownloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 self-start"
        >
          Скачать коды (CSV)
        </button>
      </div>
      <div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 justify-between items-center gap-4">
        <div className="flex flex-row w-full gap-4">
          <div className="w-1/2 flex flex-col">
            <label htmlFor="nomenclature" className="block">
              Контрагент
            </label>
            <Select
              options={counteragentOptions}
              value={selectedCounteragent}
              onChange={(option) =>
                handleCounteragentChange(
                  option as { label: string; value: string },
                )
              }
              placeholder="Выберите контрагента"
            />
          </div>
          <div className="w-1/2 flex flex-col">
            <label htmlFor="configuration" className="block">
              Датаматрикс Код
            </label>
            <input
              type="text"
              value={generatedCode}
              onChange={(e) => setGeneratedCode(e.target.value)}
              onBlur={() => validateCode(generatedCode)}
              className="border rounded-sm px-1 py-1.5 w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
