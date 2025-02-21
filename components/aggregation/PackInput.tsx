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
  const lastToastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Update local state if the value prop changes.
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // On the very first character, record the start time.
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const elapsed = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0;

    // If the user is typing slowly (elapsed > 80ms) and the value is not yet 80 chars, ignore further input.
    if (elapsed > 80 && newValue.length < 80) {
      if (Date.now() - lastToastTimeRef.current > 2000) {
        toast.error("Используйте сканнер для ввода кода");
        lastToastTimeRef.current = Date.now();
      }
      startTimeRef.current = Date.now();
      setInputValue("");
      setIsScanned(false);
      return;
    }

    // Otherwise, update the input state.
    setInputValue(newValue);

    // Once the input reaches the minimum scanned length, validate the speed.
    console.log(newValue.length >= 80, startTimeRef.current);
    if (newValue.length >= 80 && startTimeRef.current) {
      // Scanned input detected.
      console.log("Scanned input detected");

      const isValid = await onValidScan(index, newValue);
      if (isValid) {
        setIsScanned(true);
      } else {
        setInputValue("");
        setIsScanned(false);
      }
    } else {
      startTimeRef.current = Date.now();
      if (Date.now() - lastToastTimeRef.current > 2000) {
        toast.error("Используйте сканнер для ввода кода");
        lastToastTimeRef.current = Date.now();
      }
      setInputValue("");
      setIsScanned(false);
    }
  };

  const handleClearClick = () => {
    setInputValue("");
    setIsScanned(false);
    startTimeRef.current = null;
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
        className="border rounded px-1 py-2 w-full"
        ref={inputRef}
      />
      <button
        onClick={handleClearClick}
        className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
      >
        Очистить
      </button>
    </div>
  );
}
