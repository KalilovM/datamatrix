"use client";

import { useCounteragents } from "@/features/counteragents/hooks/useCounteragents";
import Layout from "@/shared/ui/Layout";
import CounteragentsTable from "@/widgets/counteragents/CounteragentsTable";

export default function CounteragentsPage() {
	const { data: counteragents, error, isLoading } = useCounteragents();

	if (isLoading) return <p>Загрузка данных...</p>;
	if (error) return <p>Ошибка: {error.message}</p>;

	return (
		<Layout>
			<CounteragentsTable counteragents={counteragents || []} />
		</Layout>
	);
}
