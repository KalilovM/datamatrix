"use client";

import useCounteragentOptions from "@/orders/hooks/useCounteragentOptions";
import useOrderEdit from "@/orders/hooks/useOrderEdit";
import { useOrderNomenclatureStore } from "@/orders/stores/useOrderNomenclatureStore";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import OrderEditForm from "@/orders/ui/OrderEditForm";
import Layout from "@/shared/ui/Layout";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
	const { id } = useParams();
	const { data, isError, isLoading } = useOrderEdit(id);
	const {
		data: counteragentOptions,
		isLoading: counteragentOptionsIsLoading,
		isError: counteragentOptionsIsError,
	} = useCounteragentOptions();
	const { setCodes } = useOrderStore();
	const { setRows } = useOrderNomenclatureStore();

	useEffect(() => {
		console.log(data);
		if (!data) return;
		setRows(data.initialRows);
		setCodes(data.initialCodes);
	}, [data, setRows]);

	if (isLoading || counteragentOptionsIsLoading) {
		return <Layout>Загрузка...</Layout>;
	}
	if (isError || counteragentOptionsIsError) {
		return <Layout>Произошла ошибка при получении данных</Layout>;
	}

	return (
		<Layout>
			<OrderEditForm
				orderData={data.orderData}
				selectedCounteragent={data.initialSelectedCounteragent}
				counteragentOptions={counteragentOptions}
			/>
		</Layout>
	);
};

export default Page;
