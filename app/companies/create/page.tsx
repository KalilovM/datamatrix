import Layout from "@/shared/ui/Layout";
import { fetchUsers } from "./actions";
import CompanyCreateForm from "./form";

// Force dynamic rendering - don't prerender at build time
export const dynamic = "force-dynamic";

export default async function Page() {
	const users = await fetchUsers();
	return (
		<Layout>
			<CompanyCreateForm users={users} />
		</Layout>
	);
}
