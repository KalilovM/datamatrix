'use client';

import { useRef } from 'react';
import { SearchIcon } from '@/app/components/Icons';

interface TableHeadingProps {
  title: string;
  onCreate: () => void;
  onSearch: (value: string) => void;
}

export function TableHeading({ title, onCreate, onSearch }: TableHeadingProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
      <div className="flex h-full items-center justify-between">
        <div className="text-xl font-bold leading-9">{title}</div>
        <div className="flex flex-row gap-3">
          <div
            className="flex items-center rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
            onClick={handleFocus}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск..."
              className="ml-2 w-full border-none text-gray-700 outline-none focus:ring-0"
              onChange={handleSearch}
            />
            <SearchIcon className="h-5 w-5 cursor-pointer text-gray-500" />
          </div>
          <button
            onClick={onCreate}
            className="rounded-md bg-blue-600 px-2 py-1 text-white"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
