"use client";

import DisaggregationForm from "@/components/disaggregation/DisaggregationForm";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";

const Page = () => {
	return (
		<Layout>
			<DisaggregationForm />
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["ADMIN", "COMPANY_USER", "COMPANY_ADMIN"],
});
