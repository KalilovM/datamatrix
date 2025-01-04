'use client';

import { useRef, useState, useEffect } from 'react';
import Button from '@/app/components/Button';
import { EditIcon, BinIcon, SearchIcon } from '@/app/components/Icons';
import { Nomenclature } from '@prisma/client';

interface NomenclatureWithCodes extends Nomenclature {
  code_count: number;
}

interface NomenclatureTableProps {
  nomenclatures: NomenclatureWithCodes[];
}

export default function NomenclatureTable({
  nomenclatures,
}: NomenclatureTableProps) {
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
      const navbarHeight = document.querySelector('nav')?.clientHeight || 0;
      const tableHeadHeight =
        tableBodyRef.current?.previousElementSibling?.clientHeight || 0;
      const containerPadding = 32 * 2 + 4;
      const availableHeight =
        window.innerHeight - navbarHeight - tableHeadHeight - containerPadding;
      setTableHeight(availableHeight);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      {/* Table Head */}
      <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="flex h-full items-center justify-between">
          <div className="text-xl font-bold leading-9">Nomenclatures</div>
          <div className="flex flex-row gap-3">
            {/* Table search field */}
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 w-full border-none text-gray-700 outline-none focus:ring-0"
              />
              <SearchIcon className="h-5 w-5 cursor-pointer text-gray-500" />
            </div>
            <button className="rounded-md bg-blue-600 px-2 py-1 text-white">
              Create
            </button>
          </div>
        </div>
      </div>
      {/* Table Body */}
      <div
        ref={tableBodyRef}
        className="flex flex-col divide-y divide-gray-200 overflow-y-auto"
        style={{ height: `${tableHeight}px` }}
      >
        {/* Table Heading */}
        <div className="flex items-center bg-gray-100 px-8 py-3 font-medium text-gray-700">
          <div className="flex-1 text-left">Name</div>
          <div className="flex w-[200px] flex-shrink-0 justify-start gap-8">
            <span>Codes Count</span>
          </div>
        </div>
        {/* Table Rows */}
        {nomenclatures.map(nomenclature => (
          <div
            key={nomenclature.id}
            className="flex items-center px-8 py-4 hover:bg-gray-100"
          >
            {/* Name */}
            <div className="flex-1 text-left text-gray-900">
              {nomenclature.name}
            </div>
            {/* Codes Count and Actions */}
            <div className="flex w-[200px] flex-shrink-0 justify-between gap-8">
              <span className="text-gray-600">{nomenclature.code_count}</span>
              <div className="flex gap-2">
                <Button
                  icon={<EditIcon className="size-5" />}
                  className="bg-blue-600 px-2.5 py-2.5 text-white hover:bg-blue-700"
                />
                <Button
                  icon={<BinIcon className="size-5" />}
                  className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
