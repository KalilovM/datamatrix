import Layout from "@/shared/ui/Layout";
import { fetchCompanyById, fetchUsers } from "./actions";
import CompanyEditForm from "./form";

export default async function Page({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const [users, company] = await Promise.all([
		fetchUsers(),
		fetchCompanyById(id),
	]);

	return (
		<Layout>
			<CompanyEditForm users={users} company={company} />
		</Layout>
	);
}
