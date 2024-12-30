'use client';

import React from 'react';
import InitialIcon from '@/app/features/InitialIcon';

export default function Avatar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative flex items-center space-x-3">
      <button
        className="relative flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open user menu</span>
        <InitialIcon initial={'A'} />
      </button>
      <div
        className={
          'absolute right-0 top-3/4 z-50 my-4 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow ' +
          (isOpen ? 'block' : 'hidden')
        }
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900">Bonnie Green</span>
          <span className="block truncate text-sm text-gray-900">
            test@email.com
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
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Выйти
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
