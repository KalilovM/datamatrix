// src/app/CodeLinksPage.tsx
"use client";

import type { NomenclatureOption } from "@/aggregation/model/types";
import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { useState } from "react";
import CodeLinksTable from "./CodeLinksTable";
import LinkedCodesTable from "./LinkedCodesTable";

const UUID4_REGEX =
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

function CodeLinksPage() {
	const [codes, setCodes] = useState<string[]>([]);
	const [nomenclature, setNomenclature] = useState<NomenclatureOption | null>(
		null,
	);
	const [printTemplate, setPrintTemplate] = useState<string | null>(null);

	return (
		<Layout className="flex-col">
			<CodeLinksTable
				onLinkedCodes={setCodes}
				onNomenclature={setNomenclature}
			/>
			<LinkedCodesTable
				linkedCodes={codes}
				nomenclature={nomenclature}
				setTemplate={setPrintTemplate}
			/>

			{printTemplate && (
				<PrintCodes
					printTemplate={printTemplate}
					selectedNomenclature={nomenclature}
				/>
			)}
		</Layout>
	);
}

export default withRole(CodeLinksPage, {
	allowedRoles: ["ADMIN", "COMPANY_ADMIN", "COMPANY_USER"],
});
