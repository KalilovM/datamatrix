"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import AggregationForm from "./ui/AggregationForm";

const Page = () => {
	return (
		<Layout className="print:block print:h-auto print:w-auto">
			<AggregationForm />
		</Layout>
	);
};

export default withRole(Page, {
	allowedRoles: ["COMPANY_ADMIN", "COMPANY_USER", "ADMIN"],
});
