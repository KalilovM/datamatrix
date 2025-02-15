import CompaniesTable from "./CompaniesTable";
import MainLayout from "../MainLayout";
import { Company } from "@prisma/client";

interface CompaniesProps {
  companies: Company[];
}

export default function Companies({ companies }: CompaniesProps) {
  return (
    <MainLayout>
      <CompaniesTable companies={companies} />
    </MainLayout>
  );
}
