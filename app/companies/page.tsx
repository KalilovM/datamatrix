import Navbar from '@/app/features/Navbar';

export default function Companies() {
  // TODO: Add dropdown element on avatar click
  return (
    <div className="flex flex-col">
      <Navbar />
      <aside
        className="fixed left-0 top-16 z-40 h-full w-64"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-[#536AC2] px-3 py-4">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="group flex items-center gap-3 rounded-lg px-2 py-3 text-gray-900 hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>

                <span>Компании</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <div className="ml-64 mt-16 h-full w-full bg-blue-50 p-4">
        <div className="rounded-lg border-gray-200 p-4"></div>
      </div>
    </div>
  );
}
