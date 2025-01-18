export default function TableLayout({ title }: { title: string }) {
  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      <div className="flex flex-col rounded-t-lg border-b border-neutral-300 bg-white px-8 py-3">
        <div className="flex h-full items-center justify-start">
          <div className="text-xl font-bold leading-9">{title}</div>
        </div>
      </div>
    </div>
  );
}
