"use server";

import Layout from "@/shared/ui/Layout";
import AggregationForm from "./ui/AggregationForm";

export default async function Page() {
	return (
		<Layout className="print:block print:h-auto print:w-auto">
			<AggregationForm />
		</Layout>
	);
}
