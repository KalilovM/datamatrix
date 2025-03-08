import CompaniesTable from "./CompaniesTable";
import MainLayout from "../MainLayout";
import { Company } from "@prisma/client";
import UsersTable from "./UsersTable";
import { User } from "@/app/users/defenitions";

interface CompaniesProps {
  companies: Company[];
  users: User[];
}

export default function Companies({ companies, users }: CompaniesProps) {
  return (
    <MainLayout>
      <CompaniesTable companies={companies} />
      <UsersTable users={users} />
    </MainLayout>
  );
}
