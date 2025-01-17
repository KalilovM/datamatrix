import TableHead from './TableHead';

interface TableLayoutProps {
  title: string;
  children: React.ReactNode;
  headingRow: React.ReactNode;
  modal: React.ReactNode;
}

export default function TableLayout({
  modal,
  title,
  children,
  headingRow,
}: TableLayoutProps) {
  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      {/* Table Head */}
      <TableHead title={title} modal={modal} />
      {/* Table Body */}
      <div className="flex flex-col divide-y divide-gray-200 overflow-y-auto">
        {/* Table Heading */}
        {headingRow}
        {/* Table Rows */}
        {children}
      </div>
    </div>
  );
}
