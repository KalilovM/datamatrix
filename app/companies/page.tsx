"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import UsersTable from "@/users/ui/UserTable";
import { useCompanies } from "./model/useCompanies";
import CompaniesTable from "./ui/CompaniesTable";

const CompaniesPage = () => {
  const { companies, users, error, loading } = useCompanies();

  if (loading) return <p className="text-center mt-10">Загрузка данных...</p>;
  if (error)
    return <p className="text-center text-red-500">Ошибка загрузки данных</p>;

  return (
    <Layout className="flex-row">
        <CompaniesTable companies={companies || []} />
        <UsersTable users={users || []} />
    </Layout>
  );
}

export default withRole(CompaniesPage, {allowedRoles: ["ADMIN", "COMPANY_ADMIN"]})
