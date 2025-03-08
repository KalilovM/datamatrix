import CompanyCreateForm from "@/components/company/create/CompanyCreateForm";
import MainLayout from "@/components/MainLayout";
import { getUsers } from "./actions";
import { v4 as uuid } from "uuid";

export default async function Page() {
  const users = await getUsers();
  const companyToken = uuid();
  return (
    <MainLayout>
      <CompanyCreateForm users={users} companyToken={companyToken} />
    </MainLayout>
  );
}
