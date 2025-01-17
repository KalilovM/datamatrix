export default function HeadingRow() {
  return (
    <div className="flex items-center bg-gray-100 px-8 py-3 font-medium text-gray-700">
      <div className="flex-1 text-left">Наименование</div>
      <div className="flex w-[200px] flex-shrink-0 justify-start gap-8">
        <span>Коды DataMatrix</span>
      </div>
    </div>
  );
}
