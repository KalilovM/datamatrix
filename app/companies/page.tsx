import Companies from "@/components/company/Companies";
import { getCompanies } from "./actions";

export default async function Page() {
  const companies = await getCompanies();

  return <Companies companies={companies} />;
}
