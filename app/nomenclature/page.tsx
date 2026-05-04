"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { useEffect, useState } from "react";
import { useNomenclatures } from "./hooks/useNomenclatures";
import { NOMENCLATURE_PAGE_SIZE } from "./model/types";
import { useNomenclatureFilterStore } from "./stores/nomenclatureFilterStore";
import { useGtinSizeStore } from "./stores/sizegtinStore";
import NomenclatureTable from "./ui/NomenclatureTable";

const Page = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const { filters, setFilters } = useNomenclatureFilterStore();
	const { reset: resetSizeGtin } = useGtinSizeStore();

	useEffect(() => {
		resetSizeGtin();
	}, [resetSizeGtin]);

	const { data: nomenclatures, isLoading, error } = useNomenclatures(
		filters,
		currentPage,
		NOMENCLATURE_PAGE_SIZE,
	);

	useEffect(() => {
		if (nomenclatures && nomenclatures.page !== currentPage) {
			setCurrentPage(nomenclatures.page);
		}
	}, [nomenclatures, currentPage]);

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (error || !nomenclatures) return <Layout>Ошибка загрузки данных</Layout>;

	return (
		<Layout>
			<NomenclatureTable
				nomenclatures={nomenclatures.items}
				currentPage={nomenclatures.page}
				pageSize={nomenclatures.pageSize}
				totalCount={nomenclatures.totalCount}
				totalPages={nomenclatures.totalPages}
				filters={filters}
				onApply={(newFilters) => {
					setCurrentPage(1);
					setFilters(newFilters);
				}}
				onPageChange={setCurrentPage}
			/>
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
