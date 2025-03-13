import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import TableContent from "@/widgets/print-templates/TableContent";

const PrintTemplatesPage: React.FC = () => {
	return (
		<Layout>
			<TableContent />
		</Layout>
	);
};

export default withRole(PrintTemplatesPage, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN"],
});
