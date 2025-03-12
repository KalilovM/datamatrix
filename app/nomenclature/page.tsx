"use client";

import Layout from "@/shared/ui/Layout";
import { useNomenclatures } from "./hooks/useNomenclatures";
import NomenclatureTable from "./ui/NomenclatureTable";

export default function Page() {
	const { data: nomenclatures, isLoading, error } = useNomenclatures();

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (error || !nomenclatures) return <Layout>Ошибка загрузки данных</Layout>;

	return (
		<Layout>
			<NomenclatureTable nomenclatures={nomenclatures} />
		</Layout>
	);
}
