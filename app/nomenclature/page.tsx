"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { useEffect, useState } from "react";
import { useNomenclatures } from "./hooks/useNomenclatures";
import { useNomenclatureFilterStore } from "./stores/nomenclatureFilterStore";
import { useGtinSizeStore } from "./stores/sizegtinStore";
import NomenclatureTable from "./ui/NomenclatureTable";

const Page = () => {
	const { filters, setFilters } = useNomenclatureFilterStore();
	const { reset: resetSizeGtin } = useGtinSizeStore();

	useEffect(() => {
		resetSizeGtin();
	}, []);

	const { data: nomenclatures, isLoading, error } = useNomenclatures(filters);

	const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (error || !nomenclatures) return <Layout>Ошибка загрузки данных</Layout>;

	return (
		<Layout>
			<NomenclatureTable
				nomenclatures={nomenclatures}
				filters={filters}
				onApply={(newFilters) => setFilters(newFilters)}
			/>
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
