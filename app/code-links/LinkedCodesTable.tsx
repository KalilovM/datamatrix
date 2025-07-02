// src/components/aggregation-codes/LinkedCodesTable.tsx
"use client";

import type { NomenclatureOption } from "@/aggregation/model/types";
import { usePrintStore } from "@/shared/store/printStore";
import { PrintIcon } from "@/shared/ui/icons";

// pull in both hooks, aliased
import { usePrintTemplate as useNomPrintTemplate } from "@/nomenclature/hooks/usePrintTemplate";
import { usePrintTemplate as useAggPrintTemplate } from "../aggregation/api/printTemplateApi";

interface Props {
	linkedCodes: string[];
	nomenclature: NomenclatureOption | null;
	setTemplate?: (template: any) => void;
}

const UUID4_REGEX =
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export default function LinkedCodesTable({
	linkedCodes,
	nomenclature,
	setTemplate,
}: Props) {
	const { setPrintCodes, setSize, triggerPrint } = usePrintStore();

	// both hooks at top level
	const { data: nomPrintTemplate } = useNomPrintTemplate();
	const { data: aggPrintTemplate } = useAggPrintTemplate();

	const handlePrint = (code: string) => {
		console.log("Printing code:", code);

		// pick the right template
		const isUuid4 = UUID4_REGEX.test(code);
		const chosenTemplate = isUuid4 ? aggPrintTemplate : nomPrintTemplate;

		if (chosenTemplate) {
			setTemplate(chosenTemplate);
		}

		// now push the code(s) and size as before
		setPrintCodes([code]);
		if (nomenclature?.size) {
			setSize(nomenclature.size);
		}

		triggerPrint();
	};

	return (
		<div className="w-full gap-4 flex flex-col print:hidden">
			<div className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
				<div className="w-1/2 flex flex-col">
					<ul>
						{linkedCodes.map((code) => (
							<li
								key={code}
								className="border-b border-gray-200 py-2 flex items-center justify-between gap-2"
							>
								<span>{code}</span>
								<button
									type="button"
									onClick={() => handlePrint(code)}
									className="p-2 rounded-md hover:bg-gray-100"
								>
									<PrintIcon className="size-5 stroke-blue-600 fill-none stroke-2" />
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
