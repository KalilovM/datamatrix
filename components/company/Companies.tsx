import CompaniesTable from "./CompaniesTable";
import MainLayout from "../MainLayout";
import { Company } from "@prisma/client";
import UsersTable from "./UsersTable";

interface CompaniesProps {
  companies: Company[];
}

export default function Companies({ companies }: CompaniesProps) {
  return (
    <MainLayout>
      <CompaniesTable companies={companies} />
      <UsersTable companies={companies} />
    </MainLayout>
  );
}
