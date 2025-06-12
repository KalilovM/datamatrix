"use client";

import type { NomenclatureOption } from "@/aggregation/model/types";
import { PrintIcon } from "@/shared/ui/icons";
import { usePrintStore } from "@/shared/store/printStore";

interface Props {
  linkedCodes: string[];
  nomenclature: NomenclatureOption | null;
}

export default function LinkedCodesTable({ linkedCodes, nomenclature }: Props) {
  const { setPrintCodes, setSize, triggerPrint } = usePrintStore();

  const handlePrint = (code: string) => {
    setPrintCodes([code]);
    if (nomenclature?.size) setSize(nomenclature.size);
    triggerPrint();
  };
  return (
    <div className="w-full gap-4 flex flex-col print:hidden">
      <div className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
        <div className="w-1/2 flex flex-col">
          <ul>
            {linkedCodes.map((code) => (
              <li key={code} className="border-b border-gray-200 py-2 flex items-center justify-between gap-2">
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
