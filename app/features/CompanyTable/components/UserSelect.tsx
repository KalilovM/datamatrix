import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface UserSelectProps {
  selectedUsers: { id: string; username: string; email: string }[];
  onUsersSelect: (
    user: {
      id: string;
      username: string;
      email: string;
    }[],
  ) => void;
  onUserRemove: (userId: string) => void;
  onCreateNewUser: () => void;
}

export const UserSelect: React.FC<UserSelectProps> = ({
  selectedUsers,
  onUsersSelect,
  onUserRemove,
  onCreateNewUser,
}) => {
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: users = [] } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      if (!search) return [];
      const res = await fetch(`/api/users?search=${search}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  const handleInputFocus = () => setDropdownOpen(true);

  const handleUserSelect = (user: {
    id: string;
    username: string;
    email: string;
  }) => {
    onUsersSelect([...selectedUsers, user]);
    setSearch('');
  };

  const handleCreateNewUser = () => {
    onCreateNewUser();
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter users to exclude already selected ones
  const filteredUsers = users.filter(
    (user: { id: string; username: string }) =>
      !selectedUsers.some(selected => selected.id === user.id),
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <input
        type="text"
        className="mb-2 w-full rounded border px-3 py-2"
        placeholder="Поиск пользователей"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={handleInputFocus}
      />
      {/* Selected Users */}
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map(user => (
          <div
            key={user.id}
            className="flex items-center rounded bg-gray-200 px-2 py-1 text-sm"
          >
            {user.username}
            <button
              onClick={() => onUserRemove(user.id)}
              className="ml-2 text-gray-500 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      {isDropdownOpen && search && (
        <div className="absolute mt-1 w-full rounded border bg-white shadow">
          {filteredUsers.map(
            (user: { id: string; username: string; email: string }) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              >
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            ),
          )}
          <div
            onClick={handleCreateNewUser}
            className="cursor-pointer px-3 py-2 text-blue-600 hover:bg-gray-100"
          >
            Create New User
          </div>
        </div>
      )}
    </div>
  );
};
