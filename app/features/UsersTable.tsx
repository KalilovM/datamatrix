import { useRef, useState, useEffect } from 'react';
import { User } from '@prisma/client';
import Button from '@/app/components/Button';
import { BinIcon, EditIcon } from '@/app/components/Icons';

interface UsersTableProps {
  users: User[];
  selectedCompanyId?: string | null;
}

export default function UsersTable({
  users,
  selectedCompanyId,
}: UsersTableProps) {
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
      <div className="flex h-full flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="text-xl font-bold leading-9">Пользователи</div>
      </div>
      {/* Table Body */}
      <div
        ref={tableBodyRef}
        className="flex flex-col divide-y divide-gray-200 overflow-y-auto"
        style={{ height: `${tableHeight}px` }}
      >
        {users.length > 0 ? (
          users.map(user => (
            <div
              key={user.id}
              className="flex items-center justify-between px-8 py-2 hover:bg-gray-100"
            >
              {/* Username */}
              <div className="flex-1 text-gray-900">{user.username}</div>
              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-4">
                <Button
                  icon={<EditIcon className={'size-5'} />}
                  className="bg-blue-600 px-2.5 py-2.5 text-white hover:bg-blue-700"
                />
                <Button
                  icon={<BinIcon className={'size-5'} />}
                  className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            {selectedCompanyId
              ? 'Нет пользователей для этой компании.'
              : 'Выберите компанию из списка слева.'}
          </div>
        )}
      </div>
    </div>
  );
}
