import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { User } from '@prisma/client';
import { TableHeading } from './TableHeader';
import { TableRow } from './TableRow';

interface UsersTableProps {
  selectedCompanyId?: string | null;
}

export default function UsersTable({ selectedCompanyId }: UsersTableProps) {
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(0);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users', selectedCompanyId],
    queryFn: async () => {
      const endpoint = selectedCompanyId
        ? `/api/companies/${selectedCompanyId}/users`
        : '/api/users';
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      return res.json();
    },
    enabled: true,
  });

  const handleCreate = () => {
    console.log('Create new user');
  };
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

  const handleSearch = (value: string) => {
    console.log('Search value:', value); // Implement search logic here
  };

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      <TableHeading
        title="Users"
        onCreate={handleCreate}
        onSearch={handleSearch}
      />
      <div
        ref={tableBodyRef}
        className="flex flex-col divide-y divide-gray-200 overflow-y-auto"
        style={{ height: `${tableHeight}px` }}
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))
          : users.map(user => <TableRow key={user.id} user={user} />)}
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between px-8 py-4">
      <div className="h-4 flex-1 rounded bg-gray-300"></div>
      <div className="ml-4 h-4 flex-1 rounded bg-gray-300"></div>
      <div className="ml-4 h-4 w-8 flex-shrink-0 rounded bg-gray-300"></div>
    </div>
  );
}
