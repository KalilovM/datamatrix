import CounteragentEditForm from "@/components/counteragents/CounteagentEditForm";
import Layout from "@/shared/ui/Layout";
import { getCounteragentById } from "./actions";

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
	};

	return (
		<Layout>
			<CounteragentEditForm initialData={initialData} />
		</Layout>
	);
}
