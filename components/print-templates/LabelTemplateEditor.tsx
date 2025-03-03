"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

// Define the text fields and their Russian labels
const textFields = ["name", "modelArticle", "color", "size"];
const fieldLabels = {
  name: "Имя",
  modelArticle: "Модель",
  color: "Цвет",
  size: "Размер",
};

const LabelEditor = () => {
  // State for QR code position ("left" or "right")
  const [qrPosition, setQrPosition] = useState("right");
  const router = useRouter();

  // State for text field selections (one per row)
  const [selections, setSelections] = useState(Array(4).fill(""));

  // Compute available options for a given selector (exclude those already chosen in other rows)
  const getAvailableOptions = (currentValue) => {
    const selectedValues = selections.filter(
      (val) => val !== "" && val !== currentValue,
    );
    return textFields.filter((field) => !selectedValues.includes(field));
  };

  // Handle change in one of the field selectors
  const handleSelectionChange = (index, value) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = value;
      return newSelections;
    });
  };

  // Save template to backend and trigger toast notifications
  const handleSave = async () => {
    const payload = {
      qrPosition,
      textFields: selections.filter((s) => s !== ""),
    };

    try {
      const res = await fetch("/api/printing-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Шаблон успешно сохранен!");
        router.push("/print-templates");
      } else {
        const errorData = await res.json();
        toast.error(
          errorData.message || "Произошла ошибка при сохранении шаблона",
        );
      }
    } catch (error) {
      toast.error("Произошла ошибка при сохранении шаблона");
      console.error("Save error:", error);
    }
  };

  // Optional: compute scale for the printing area based on parent dimensions
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (canvasRef.current) {
      const parentWidth = canvasRef.current.parentElement?.clientWidth || 1;
      const parentHeight = window.innerHeight * 0.35;
      const scaleX = parentWidth / 58;
      const scaleY = parentHeight / 40;
      setScale(Math.min(scaleX, scaleY));
      console.log("Canvas parent:", parentWidth, parentHeight);
    }
  }, []);
  const canvasWidth = Math.round(58 * scale);
  const canvasHeight = Math.round(40 * scale);

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="leading-6 text-xl font-bold">Новый шаблон печати</h1>
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
        >
          Сохранить шаблон
        </button>
      </div>
      {/* QR Code Position Selector */}
      <div className="p-4 border rounded-lg bg-white border-blue-600">
        <h2 className="text-lg font-bold mb-2">Настройка QR кода</h2>
        <label className="block mb-2">Позиция QR кода:</label>
        <select
          value={qrPosition}
          onChange={(e) => setQrPosition(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        >
          <option value="left">Слева</option>
          <option value="right">Справа</option>
        </select>
      </div>

      {/* Text Fields Selectors */}
      <div className="p-4 border rounded-lg bg-white border-blue-600">
        <h2 className="text-lg font-bold mb-2">Настройка текстовых полей</h2>
        {selections.map((sel, index) => (
          <div key={index} className="mb-2">
            <label className="block mb-1">Поле {index + 1}:</label>
            <select
              value={sel}
              onChange={(e) => handleSelectionChange(index, e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Выберите поле</option>
              {getAvailableOptions(sel).map((option) => (
                <option key={option} value={option}>
                  {fieldLabels[option]}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Printing Area */}
      <div
        ref={canvasRef}
        className="border border-blue-600 rounded-lg relative mx-auto bg-white print:w-[58mm] print:h-[40mm]"
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        <div className="flex h-full">
          {qrPosition === "left" && (
            <div className="flex-shrink-0" style={{ width: "40%" }}>
              {/* QR Code Area */}
              <div className="w-full h-full flex flex-col justify-center items-center border-r border-blue-600">
                <div className="bg-gray-200 w-20 h-20 flex items-center justify-center">
                  QR код
                </div>
                <span className="mt-2 text-sm">QR код с текстом</span>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Display selected text fields */}
            {selections.filter((s) => s !== "").length > 0 ? (
              selections
                .filter((s) => s !== "")
                .map((sel, i) => (
                  <div key={i} className="mb-1">
                    <span className="text-xl font-bold">
                      {fieldLabels[sel]}
                    </span>
                  </div>
                ))
            ) : (
              <span className="text-center text-gray-400">
                Выберите текстовые поля
              </span>
            )}
          </div>

          {qrPosition === "right" && (
            <div className="flex-shrink-0" style={{ width: "40%" }}>
              {/* QR Code Area */}
              <div className="w-full h-full flex flex-col justify-center items-center border-l border-blue-600">
                <div className="bg-gray-200 w-20 h-20 flex items-center justify-center">
                  QR код
                </div>
                <span className="mt-2 text-sm">Текст кода</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabelEditor;
