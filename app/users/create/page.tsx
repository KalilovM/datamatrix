import Layout from "@/shared/ui/Layout";
import { fetchCompanies } from "./actions";
import UserCreateForm from "./form";

export default async function Page() {
	const companies = await fetchCompanies();
	return (
		<Layout>
			<UserCreateForm companies={companies} />
		</Layout>
	);
}
