import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TableRow } from './TableRow';
import { TableHeader } from './TableHeader';
import { Company } from '@prisma/client';
import { CompanyCreationModal } from './CompanyCreationModal';
import { CompanyFormValues } from '@/types/company/types';

interface CompanyTableProps {
  onSelect: (companyId: string) => void;
}

export default function CompanyTable({ onSelect }: CompanyTableProps) {
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);

  const {
    data: companies = [],
    isLoading,
    refetch,
  } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await fetch('/api/companies');
      if (!res.ok) {
        throw new Error('Failed to fetch companies');
      }
      return res.json();
    },
  });

  const handleCreate = () => {
    setCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (company: CompanyFormValues) => {
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        body: JSON.stringify(company),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to create company');
      }
      refetch();

      console.log(company);
    } catch (e: unknown) {
      console.error('Failed to create company:', e);
    }
  };

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      <TableHeader title="Компании" onCreate={handleCreate} />
      <CompanyCreationModal
        isOpen={isCompanyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSubmit={handleCompanySubmit}
      />
      <div
        ref={tableBodyRef}
        className="flex flex-col divide-y divide-gray-200 overflow-y-auto"
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))
          : companies.map(company => (
              <TableRow
                key={company.id}
                company={company}
                onSelect={onSelect}
              />
            ))}
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between px-8 py-4">
      <div className="h-4 flex-1 rounded-lg bg-gray-300"></div>
      <div className="ml-4 h-4 flex-1 rounded-lg bg-gray-300"></div>
      <div className="ml-4 h-4 w-8 flex-shrink-0 rounded-lg bg-gray-300"></div>
    </div>
  );
}
