"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

interface PackInputProps {
  index: number;
  value: string;
  onValidScan: (index: number, value: string) => Promise<boolean>;
  onClear: () => void;
  inputRef: (el: HTMLInputElement | null) => void;
}

export default function PackInput({
  index,
  value,
  onValidScan,
  onClear,
  inputRef,
}: PackInputProps) {
  // Local state for the input value and a flag to mark scanned input.
  const [inputValue, setInputValue] = useState(value);
  const [isScanned, setIsScanned] = useState(false);

  // Update local state if the value prop changes.
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputValue(newValue);

    const isValid = await onValidScan(index, newValue);
    if (isValid) {
      setIsScanned(true);
    } else {
      setInputValue("");
      setIsScanned(false);
    }
  };

  const handleClearClick = () => {
    setInputValue("");
    setIsScanned(false);
    onClear();
  };

  return (
    <div className="flex items-center px-8 py-3 my-1">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        readOnly={isScanned}
        placeholder="Отсканируйте код"
        className="border rounded-sm px-1 py-2 w-full"
        ref={inputRef}
      />
      <button
        onClick={handleClearClick}
        className="ml-2 bg-red-500 text-white px-2 py-1 rounded-sm"
      >
        Очистить
      </button>
    </div>
  );
}
