"use client";

import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import CodeLinksTable from "./CodeLinksTable";
import LinkedCodesTable from "./LinkedCodesTable";

const CompaniesPage = () => {
	return (
		<Layout className="flex-col">
			<CodeLinksTable />
			<LinkedCodesTable />
		</Layout>
	);
};

export default withRole(CompaniesPage, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN", "COMPANY_USER"],
});
