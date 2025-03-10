"use client";

import { useCounteragents } from "@/features/counteragents/hooks/useCounteragents";
import Layout from "@/shared/ui/Layout";
import CounteragentsTable from "@/widgets/counteragents/CounteragentsTable";

export default function CounteragentsPage() {
	const { data: counteragents, error, isLoading } = useCounteragents();

	if (isLoading) return <Layout> Загрузка данных... </Layout>;
	if (error) return <Layout> Ошибка загрузки данных </Layout>;

	return (
		<Layout>
			<CounteragentsTable counteragents={counteragents || []} />
		</Layout>
	);
}
