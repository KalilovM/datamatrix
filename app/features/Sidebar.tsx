'use client';

import { sidebarItems } from '@/app/config/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-40 h-full w-64 bg-[#536AC2] px-3 py-4">
      <ul className="space-y-2 font-medium">
        {sidebarItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-2 py-3 ${
                pathname === item.href
                  ? 'bg-[#B8CAFF] text-neutral-800'
                  : 'hover:text-[#B8CAFF]'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}