import Layout from "@/shared/ui/Layout";
import UserCreateForm from "@/components/user/create/UserCreateForm";
import { getCompanies } from "./actions";

export default async function Page() {
  const companies = await getCompanies();
  return (
    <Layout>
      <UserCreateForm companies={companies} />
    </Layout>
  );
}
