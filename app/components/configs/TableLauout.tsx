import TableHead from './TableHead';
import { Config } from '@/app/features/Configs/components/ConfigTable';

interface TableLayoutProps {
  title: string;
  children: React.ReactNode;
  headingRow: React.ReactNode;
  configOptions: Config[];
  nomenclatureId: string;
}

export default function TableLayout({
  title,
  children,
  headingRow,
  configOptions,
  nomenclatureId,
}: TableLayoutProps) {
  return (
    <div className="h-full w-full rounded-lg border border-blue-300 bg-white">
      {/* Table Head */}
      <TableHead
        title={title}
        options={configOptions}
        nomenclatureId={nomenclatureId}
      />
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
