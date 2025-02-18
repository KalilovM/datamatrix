import Companies from "@/components/company/Companies";
import { getCompanies } from "./actions";
import { getUsers } from "../users/actions";

export default async function Page() {
  const companies = await getCompanies();
  const users = await getUsers();

  return <Companies companies={companies} users={users} />;
}
