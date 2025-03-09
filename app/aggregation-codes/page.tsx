import TableContent from "@/components/aggregation-codes/TableContent";
import Layout from "@/shared/ui/Layout";
import { getAggregatedCodes, getDefaultPrintTemplate } from "./actions";

export default async function Page() {
	const aggregatedCodes = await getAggregatedCodes();
	const defaultTemplate = await getDefaultPrintTemplate();
	return (
		<Layout>
			<TableContent
				aggregatedCodes={aggregatedCodes}
				defaultTemplate={defaultTemplate}
			/>
		</Layout>
	);
}
