import { ChevronRightIcon } from '@/app/components/Icons';
import { useCompanyStore } from '@/stores/useCompanyStore';
import { Company } from '@prisma/client';

interface TableRowProps {
  company: Company;
  onSelect: (id: string) => void;
}

export function TableRow({ company, onSelect }: TableRowProps) {
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyStore();

  const handleClick = () => {
    setSelectedCompanyId(company.id);
    onSelect(company.id);
  };

  return (
    <div
      className={`flex cursor-pointer items-center justify-between px-8 py-4 ${
        selectedCompanyId === company.id
          ? 'bg-blue-100 text-blue-900'
          : 'hover:bg-gray-100'
      }`}
      onClick={handleClick}
    >
      <div className="flex-1">{company.name}</div>
      <div className="flex-1 text-gray-600">
        {new Date(company.subscriptionEnd).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div className="flex-shrink-0">
        <ChevronRightIcon />
      </div>
    </div>
  );
}
