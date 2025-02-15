import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";
import { EditIcon } from "../Icons";

interface CompanyRowProps {
  company: Company;
  onSelect: (id: string) => void;
  selectedCompanyId: string | null;
}

export default function CompanyRow({
  company,
  onSelect,
  selectedCompanyId,
}: CompanyRowProps) {
  const router = useRouter();
  const handleClick = () => {
    onSelect(company.id);
  };
  return (
    <div
      className={`flex cursor-pointer items-center justify-between px-8 py-4 ${
        selectedCompanyId === company.id
          ? "bg-blue-100 text-blue-900"
          : "hover:bg-gray-100"
      }`}
      onClick={handleClick}
    >
      <div className="flex-1">{company.name}</div>
      <div className="flex-1 text-gray-600">
        {new Date(company.subscriptionEnd).toLocaleDateString("ru-RU", {
          timeZone: "Europe/Moscow",
        })}
      </div>
      <div className="flex flex-shrink-0 flex-row items-center justify-items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/companies/edit/${company.id}`);
          }}
          className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white"
        >
          <span>
            <EditIcon className="size-5" />
          </span>
        </button>
      </div>
    </div>
  );
}
