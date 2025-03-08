import Layout from "@/shared/ui/Layout";
import { fetchCompanies, fetchUser } from "./actions";
import UserEditForm from "./form";

interface PageProps {
	params: { id: string };
}

export default async function Page({ params }: PageProps) {
	const user = await fetchUser(params.id);
	const companies = await fetchCompanies();

	return (
		<Layout>
			<UserEditForm user={user} companies={companies} />
		</Layout>
	);
}
