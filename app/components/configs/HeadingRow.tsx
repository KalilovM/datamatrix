export default function HeadingRow() {
  return (
    <div className="flex items-center bg-gray-100 px-8 py-3 font-medium text-gray-700">
      <div className="w-1/3 text-left">Кол-во в пачке</div>
      <div className="w-1/3 text-left">Кол-во в паллете</div>
      <div className="w-1/3 text-right">Действия</div>
    </div>
  );
}
