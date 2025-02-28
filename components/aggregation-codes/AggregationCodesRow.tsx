import { IAggregatedCode } from "@/app/aggregation-codes/defenitions";
import { PrintIcon } from "../Icons";

export default function AggregationCodesRow({
  aggregatedCodes,
}: {
  aggregatedCodes: IAggregatedCode[];
}) {
  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        {/* Table Header */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Наименование
            </th>
            <th scope="col" className="px-6 py-3">
              Агрегированный код
            </th>
            <th scope="col" className="px-6 py-3">
              Конфигурация
            </th>
            <th scope="col" className="px-6 py-3">
              Пачка/Паллет
            </th>
            <th scope="col" className="px-6 py-3">
              Дата
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Действие</span>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {aggregatedCodes.map((code) => (
            <tr
              key={code.generatedCode}
              className="bg-white border-b border-gray-200 hover:bg-gray-50"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {code.name}
              </th>
              <td className="px-6 py-4">{code.generatedCode}</td>
              <td className="px-6 py-4">{code.configuration}</td>
              <td className="px-6 py-4">{code.type}</td>
              <td className="px-6 py-4">
                {new Date(code.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-4 rounded-md shadow-md">
                  <PrintIcon className="size-5 stroke-blue-600 fill-none stroke-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
