"use client";

import Layout from "@/shared/ui/Layout";
import PrintTemplateEditForm from "@/widgets/print-templates/PrintTemplateEditForm";
import { useParams } from "next/navigation";
import { usePrintTemplateEdit } from "../../hooks/usePrintTemplateEdit";

const PrintTemplateEditPage = () => {
	const { id } = useParams();
	const { data, isLoading, isError } = usePrintTemplateEdit(id);

	if (isLoading) return <Layout>Загрузка...</Layout>;
	if (isError) return <Layout>Ошибка при загрузке данных</Layout>;

	return (
		<Layout>
			{/* Pass the initial data and flag to the form */}
			<PrintTemplateEditForm initialData={data} />
		</Layout>
	);
};

export default PrintTemplateEditPage;
