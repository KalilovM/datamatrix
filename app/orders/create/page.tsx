"use client";

import OrderCreationForm from "@/components/orders/OrderCreationForm";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import useCounteragentOptions from "../hooks/useCounteragentOptions";

const Page = () => {
	const {
		data: counteragentOptions,
		isLoading,
		isError,
	} = useCounteragentOptions();
	if (isLoading) {
		return <Layout>Загрузка...</Layout>;
	}
	if (isError) {
		return <Layout>Произошла ошибка: {isError.message}</Layout>;
	}
	return (
		<Layout>
			<OrderCreationForm counteragentOptions={counteragentOptions} />
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_USER", "COMPANY_ADMIN"],
});
