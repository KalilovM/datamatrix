import CompanyEditForm from "@/components/company/edit/CompanyEditForm";
import MainLayout from "@/components/MainLayout";
import { getUsers, getCompany } from "../edit/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const users = await getUsers();
  const company = await getCompany((await params).id);

  if (!company) {
    // Handle case where company is not found.
    return (
      <MainLayout>
        <p>Компания не найдена.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CompanyEditForm users={users} company={company} />
    </MainLayout>
  );
}
