"use client";

export default function OrderCodesList({ codes }: { codes: string[] }) {
  return (
    <div className="table-layout flex flex-col h-full">
      <div className="table-header flex justify-between items-center">
        <p className="table-header-title">Коды</p>
      </div>
      <div className="table-rows-layout flex-1">
        {codes.length === 0 ? (
          <p className="text-gray-500 p-4">Нет связанных кодов</p>
        ) : (
          <ul>
            {codes.map((code) => (
              <li key={code} className="p-2 border-b border-gray-200">
                {code}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
