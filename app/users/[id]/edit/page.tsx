import UserEditForm from "@/components/user/UserEditForm";
import MainLayout from "@/components/MainLayout";
import { getUser, getCompanies } from "./actions";

export default async function Page({ params }: { params: { id: string } }) {
  const companies = await getCompanies();
  const user = await getUser(params.id);

  if (!user) {
    return (
      <MainLayout>
        <p>Пользователь не найден.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <UserEditForm user={user} companies={companies} />
    </MainLayout>
  );
}
