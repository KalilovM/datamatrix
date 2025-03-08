import Layout from "@/shared/ui/Layout";
import { fetchUsers } from "./actions";
import CompanyCreateForm from "./form";

export default async function Page() {
	const users = await fetchUsers();
	return (
		<Layout>
			<CompanyCreateForm users={users} />
		</Layout>
	);
}
