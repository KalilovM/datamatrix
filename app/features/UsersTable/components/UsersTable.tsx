import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { UserCreationModal } from './UserCreationModal';
import { User } from '@prisma/client';
import { TableHeading } from './TableHeader';
import { TableRow } from './TableRow';
import { UserFormValues } from '@/types/company/types';

interface UsersTableProps {
  selectedCompanyId?: string | null;
}

export default function UsersTable({ selectedCompanyId }: UsersTableProps) {
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery<User[]>({
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
    setUserModalOpen(true);
  };

  const handleUserSubmit = async (newUser: UserFormValues) => {
    const user = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      companyId: newUser.companyId,
    };
    try {
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      refetch();
    } catch (e: unknown) {
      console.error('Failed to create user:', e);
    }
  };

  const handleSearch = (value: string) => {
    console.log('Search value:', value); // Implement search logic here
  };

  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      <TableHeading
        title="Пользователи"
        onCreate={handleCreate}
        onSearch={handleSearch}
      />
      {/* User Creation Modal */}
      <UserCreationModal
        isOpen={isUserModalOpen}
        onClose={() => setUserModalOpen(false)} // Close the modal
        onSubmit={handleUserSubmit} // Handle user submission
      />
      <div
        ref={tableBodyRef}
        className="flex flex-col divide-y divide-gray-200 overflow-y-auto"
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
      <div className="h-4 flex-1 rounded-lg bg-gray-300"></div>
      <div className="ml-4 h-4 flex-1 rounded-lg bg-gray-300"></div>
      <div className="ml-4 h-4 w-8 flex-shrink-0 rounded-lg bg-gray-300"></div>
    </div>
  );
}
