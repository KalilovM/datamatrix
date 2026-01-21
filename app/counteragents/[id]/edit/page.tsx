import CounteragentEditForm from "@/components/counteragents/CounteragentEditForm";
import Layout from "@/shared/ui/Layout";
import { getCounteragentById } from "./actions";

// Force dynamic rendering - don't prerender at build time
export const dynamic = "force-dynamic";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const counteragentId = (await params).id;
	const counteragent = await getCounteragentById(counteragentId);

	if (!counteragent) {
		return (
			<Layout>
				<p>Контрагент не найден</p>
			</Layout>
		);
	}

	const initialData = {
		id: counteragent.id,
		name: counteragent.name,
		inn: counteragent.inn,
		kpp: counteragent.kpp,
	};

	return (
		<Layout>
			<CounteragentEditForm initialData={initialData} />
		</Layout>
	);
}
