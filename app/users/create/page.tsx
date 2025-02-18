import MainLayout from "@/components/MainLayout";
import UserCreateForm from "@/components/user/create/UserCreateForm";
import { getCompanies } from "./actions";

export default async function Page() {
  const companies = await getCompanies();
  return (
    <MainLayout>
      <UserCreateForm companies={companies} />
    </MainLayout>
  );
}
