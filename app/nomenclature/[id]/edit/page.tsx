import Layout from "@/shared/ui/Layout";
import { fetchNomenclatureById } from "../../model/actions";
import NomenclatureEditForm from "../../ui/edit/NomenclatureEditForm";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function Page(props: Props) {
	const params = await props.params;
	const nomenclature = await fetchNomenclatureById(params.id);
	console.log(nomenclature);
	if (!nomenclature) {
		return <Layout>Номенклатура не найдена</Layout>;
	}

	return (
		<Layout>
			<NomenclatureEditForm nomenclature={nomenclature} />
		</Layout>
	);
}
