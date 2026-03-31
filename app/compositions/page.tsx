"use client";

import { useCompositions } from "@/features/compositions/hooks/useCompositions";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import CompositionsTable from "@/widgets/compositions/CompositionsTable";

const CompositionsPage = () => {
	const { data: compositions, error, isLoading } = useCompositions();

	if (isLoading) return <Layout>Загрузка данных...</Layout>;
	if (error) return <Layout>Ошибка загрузки данных</Layout>;

	return (
		<Layout>
			<CompositionsTable compositions={compositions || []} />
		</Layout>
	);
};

export default withRole(CompositionsPage, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
