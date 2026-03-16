// src/app/CodeLinksPage.tsx
"use client";

import type { NomenclatureOption } from "@/aggregation/model/types";
import type { PrintTemplate } from "@/aggregation/model/types";
import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import { useState } from "react";
import CodeLinksTable from "./CodeLinksTable";
import LinkedCodesTable from "./LinkedCodesTable";

function CodeLinksPage() {
	const [codes, setCodes] = useState<string[]>([]);
	const [nomenclature, setNomenclature] = useState<NomenclatureOption | null>(
		null,
	);
	const [printTemplate, setPrintTemplate] = useState<PrintTemplate | null>(null);

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
