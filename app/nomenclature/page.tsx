import Layout from "@/shared/ui/Layout";
import { fetchNomenclatures } from "./model/actions";
import NomenclatureTable from "./ui/NomenclatureTable";

export default async function Page() {
	const nomenclatures = await fetchNomenclatures();

	return (
		<Layout>
			<NomenclatureTable nomenclatures={nomenclatures} />
		</Layout>
	);
}
