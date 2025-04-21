"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { useEffect, useState } from "react";
import { useNomenclatures } from "./hooks/useNomenclatures";
import { useGtinSizeStore } from "./stores/sizegtinStore";
import NomenclatureTable from "./ui/NomenclatureTable";

const Page = () => {
	const [tempFilters, setTempFilters] = useState({
		name: "",
		modelArticle: "",
		color: "",
		gtin: "",
	});
	const [filters, setFilters] = useState(tempFilters); // actual applied filters
	const { reset: resetSizeGtin } = useGtinSizeStore();
	useEffect(() => {
		resetSizeGtin();
	}, []);

	const { data: nomenclatures, isLoading, error } = useNomenclatures(filters);

	const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const applyFilters = () => {
		setFilters(tempFilters);
	};

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (error || !nomenclatures) return <Layout>Ошибка загрузки данных</Layout>;

	return (
		<Layout>
			<NomenclatureTable
				nomenclatures={nomenclatures}
				filters={tempFilters}
				handleFiltersChange={handleTempChange}
				onApply={applyFilters}
			/>
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
