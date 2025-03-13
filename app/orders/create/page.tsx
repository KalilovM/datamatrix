"use server";

import OrderCreationForm from "@/components/orders/OrderCreationForm";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { getCounteragentOptions } from "./actions";

const Page= () => {
	const counteragentOptions = await getCounteragentOptions();
	return (
		<Layout>
			<OrderCreationForm counteragentOptions={counteragentOptions} />
		</Layout>
	);
}


export default withRole(Page, {allowedRoles:["ADMIN", "COMPANY_USER", "COMPANY_ADMIN"]})
