"use client";

import Layout from "@/shared/ui/Layout";
import { useCompanies, useUser } from "@/users/hooks/useUser";
import { useParams } from "next/navigation";
import UserEditForm from "./form";

export default function Page() {
	const { id } = useParams();
	const { data: user, isLoading: userLoading, error: userError } = useUser(id);
	const {
		data: companies,
		isLoading: companiesLoading,
		error: companiesError,
	} = useCompanies();

	if (userLoading || companiesLoading) return <Layout>Загрузка...</Layout>;
	if (userError || companiesError) return <Layout>Ошибка</Layout>;
	if (!user || !companies) return <Layout>Не найдено</Layout>;

	return (
		<Layout>
			<UserEditForm user={user} companies={companies} />
		</Layout>
	);
}
