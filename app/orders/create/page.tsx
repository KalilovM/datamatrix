"use server";

import OrderCreationForm from "@/components/orders/OrderCreationForm";
import Layout from "@/shared/ui/Layout";
import { getCounteragentOptions } from "./actions";

export default async function Page() {
	const counteragentOptions = await getCounteragentOptions();
	return (
		<Layout>
			<OrderCreationForm counteragentOptions={counteragentOptions} />
		</Layout>
	);
}
