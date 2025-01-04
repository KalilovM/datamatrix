'use client';

import React from 'react';
import InitialIcon from '@/app/features/InitialIcon';
import useAuthStore from '@/stores/useAuthStore';
import useInitializeAuth from '@/app/hooks/useInitializeAuth';
import { redirect } from 'next/navigation';

export default function Avatar() {
  useInitializeAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const { user, isAuthenticated, clearUser } = useAuthStore();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'GET',
    });
    clearUser();
    setIsOpen(false);
    redirect('/login');
  };

  return (
    <div className="relative flex items-center space-x-3">
      <button
        className="relative flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open user menu</span>
        <InitialIcon initial={user?.username?.charAt(0).toUpperCase() || 'U'} />
      </button>
      <div
        className={
          'absolute right-0 top-3/4 z-50 my-4 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow ' +
          (isOpen ? 'block' : 'hidden')
        }
      >
        {isAuthenticated && user ? (
          <>
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">
                {user.username}
              </span>
              <span className="block truncate text-sm text-gray-900">
                {user.email}
              </span>
            </div>
            <ul className="py-2">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Настройки
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </li>
            </ul>
          </>
        ) : (
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-500">Not logged in</span>
          </div>
        )}
      </div>
    </div>
  );
}
