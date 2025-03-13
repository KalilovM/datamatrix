"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { useNomenclatures } from "./hooks/useNomenclatures";
import NomenclatureTable from "./ui/NomenclatureTable";

const Page = () => {
	const { data: nomenclatures, isLoading, error } = useNomenclatures();

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (error || !nomenclatures) return <Layout>Ошибка загрузки данных</Layout>;

	return (
		<Layout>
			<NomenclatureTable nomenclatures={nomenclatures} />
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
