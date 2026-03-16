import UserEditForm from "@/components/user/UserEditForm";
import Layout from "@/shared/ui/Layout";
import { getUser, getCompanies } from "./actions";

export default async function Page({ params }: { params: { id: string } }) {
  const companies = await getCompanies();
  const user = await getUser(params.id);

  if (!user) {
    return (
      <Layout>
        <p>Пользователь не найден.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <UserEditForm
        user={{
          ...user,
          role: user.role ?? "COMPANY_USER",
        }}
        companies={companies}
      />
    </Layout>
  );
}
