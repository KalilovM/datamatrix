import CompositionEditForm from "@/components/compositions/CompositionEditForm";
import Layout from "@/shared/ui/Layout";
import { getCompositionById } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const compositionId = (await params).id;
	const composition = await getCompositionById(compositionId);

	if (!composition) {
		return (
			<Layout>
				<p>Состав не найден</p>
			</Layout>
		);
	}

	return (
		<Layout>
			<CompositionEditForm initialData={composition} />
		</Layout>
	);
}
