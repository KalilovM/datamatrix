'use client';

import { ChevronRightIcon, SearchIcon } from '@/app/components/Icons';
import { Company } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

interface CompanyTableProps {
  onSelect: (companyId: string) => void;
  companies: Company[];
}

export default function CompanyTable({
  onSelect,
  companies,
}: CompanyTableProps) {
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCompanyClick = (companyId: string) => {
    console.log('Company ID:', companyId);
    setSelectedCompanyId(companyId); // Update the selected company ID
    onSelect(companyId); // Notify the parent component
  };

  useEffect(() => {
    const calculateHeight = () => {
      const navbarHeight = document.querySelector('nav')?.clientHeight || 0;
      const sidebarHeight = window.innerHeight;
      const tableHeadHeight =
        tableBodyRef.current?.previousElementSibling?.clientHeight || 0;
      const containerPadding = 32 * 2 + 4;
      const availableHeight =
        sidebarHeight - navbarHeight - tableHeadHeight - containerPadding;
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
      <div className="flex h-full flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="flex h-full items-center justify-between">
          <div className="text-xl font-bold leading-9">Компании</div>
          <div className="flex flex-row gap-3">
            {/* Table search field */}
            <div
              className="flex items-center rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
              onClick={handleFocus}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Поиск..."
                className="ml-2 w-full border-none text-gray-700 outline-none focus:ring-0"
              />
              <SearchIcon className="h-5 w-5 cursor-pointer text-gray-500" />
            </div>
            <button className="rounded-md bg-blue-600 px-2 py-1 text-white">
              Создать
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
        {companies.map(company => (
          <div
            key={company.id}
            className={`flex cursor-pointer items-center justify-between px-8 py-4 ${
              selectedCompanyId === company.id
                ? 'bg-blue-100 text-blue-900' // Active row styles
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleCompanyClick(company.id)}
          >
            {/* Company Name */}
            <div className="flex-1">{company.name}</div>
            {/* Subscription End */}
            <div className="flex-1 text-gray-600">
              {new Date(company.subscriptionEnd).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {/* Chevron Icon */}
            <div className="flex-shrink-0">
              <ChevronRightIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
