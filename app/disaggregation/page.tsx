"use server";

import DisaggregationForm from "@/components/disaggregation/DisaggregationForm";
import Layout from "@/shared/ui/Layout";

export default async function Page() {
	return (
		<Layout>
			<DisaggregationForm />
		</Layout>
	);
}
