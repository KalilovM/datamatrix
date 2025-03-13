"use client";

import { useCounteragents } from "@/features/counteragents/hooks/useCounteragents";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import CounteragentsTable from "@/widgets/counteragents/CounteragentsTable";

const CounteragentsPage = () => {
	const { data: counteragents, error, isLoading } = useCounteragents();

	if (isLoading) return <Layout> Загрузка данных... </Layout>;
	if (error) return <Layout> Ошибка загрузки данных </Layout>;

	return (
		<Layout>
			<CounteragentsTable counteragents={counteragents || []} />
		</Layout>
	);
};

export default withRole(CounteragentsPage, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
