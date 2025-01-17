import { SearchIcon } from './Icons';

export default function TableSearchField() {
  return (
    <div className="flex items-center rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Поиск..."
        className="ml-2 w-full border-none text-gray-700 outline-none focus:ring-0"
      />
      <SearchIcon className="h-5 w-5 cursor-pointer text-gray-500" />
    </div>
  );
}
