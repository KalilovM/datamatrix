import { IAggregatedCode } from "@/app/aggregation-codes/defenitions";

export default function AggregationCodesRow({
  aggregatedCodes,
}: {
  aggregatedCodes: IAggregatedCode[];
}) {
  return (
    <div>
      <div className="table-row-header">
        <span>Название</span>
        <span>Сгенерированный код</span>
        <span>Конфигурация</span>
        <span>Тип</span>
        <span>Дата создания</span>
        <span>Действия</span>
      </div>

      <div className="table-rows-layout">
        {aggregatedCodes.map((code) => (
          <div key={code.generatedCode} className="table-row">
            <span>{code.name}</span>
            <span>{code.generatedCode}</span>
            <span>{code.configuration}</span>
            <span>{code.type}</span>
            <span>{new Date(code.createdAt).toLocaleDateString()}</span>
            <button className="bg-gray-200 px-2 py-1 rounded-md">🖨️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
