"use client";

import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { useNomenclatureById } from "@/nomenclature/hooks/useNomenclatureById";
import { usePrintTemplate } from "@/nomenclature/hooks/usePrintTemplate";
import { useNomenclatureStore } from "@/nomenclature/model/store";
import NomenclatureEditForm from "@/nomenclature/ui/edit/NomenclatureEditForm";
import Layout from "@/shared/ui/Layout";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const params = useParams();
	const { id } = params;
	const { data: nomenclatureData, isLoading, error } = useNomenclatureById(id);
	const {
		data: printTemplateData,
		isLoading: isPrintTemplateLoading,
		error: printTemplateError,
	} = usePrintTemplate();
	const { nomenclature, setPrintTemplate } = useNomenclatureStore();

	useEffect(() => {
		if (!isPrintTemplateLoading && !printTemplateError && printTemplateData) {
			setPrintTemplate(printTemplateData);
		}
	}, [
		isPrintTemplateLoading,
		printTemplateError,
		printTemplateData,
		setPrintTemplate,
	]);

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (error || !nomenclature) return <Layout>Номенклатура не найдена</Layout>;

	return (
		<Layout>
			<NomenclatureEditForm nomenclature={nomenclatureData} />
			{printTemplateData && (
				<PrintCodes
					printTemplate={printTemplateData}
					selectedNomenclature={nomenclature}
				/>
			)}
		</Layout>
	);
}
