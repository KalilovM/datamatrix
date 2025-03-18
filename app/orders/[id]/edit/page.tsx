"use client";

import useCounteragentOptions from "@/orders/hooks/useCounteragentOptions";
import useOrderEdit from "@/orders/hooks/useOrderEdit";
import OrderEditForm from "@/orders/ui/OrderEditForm";
import Layout from "@/shared/ui/Layout";
import { useParams } from "next/navigation";

const Page = () => {
	const { id } = useParams();
	const { data, isError, isLoading } = useOrderEdit(id);
	const {
		data: counteragentOptions,
		isLoading: counteragentOptionsIsLoading,
		isError: counteragentOptionsIsError,
	} = useCounteragentOptions();

	if (isLoading || counteragentOptionsIsLoading) {
		return <Layout>Загрузка...</Layout>;
	}
	if (isError || counteragentOptionsIsError) {
		return <Layout>Произошла ошибка при получении данных</Layout>;
	}

	return (
		<Layout>
			<OrderEditForm
				id={id}
				initialData={data}
				counteragentOptions={counteragentOptions}
			/>
		</Layout>
	);
};

export default Page;
