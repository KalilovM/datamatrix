"use client";

import { useState } from "react";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import CodeLinksTable from "./CodeLinksTable";
import LinkedCodesTable from "./LinkedCodesTable";
import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { usePrintTemplate } from "@/nomenclature/hooks/usePrintTemplate";
import type { NomenclatureOption } from "@/aggregation/model/types";

function CodeLinksPage() {
  const [codes, setCodes] = useState<string[]>([]);
  const [nomenclature, setNomenclature] = useState<NomenclatureOption | null>(null);
  const { data: printTemplate } = usePrintTemplate();

  return (
    <Layout className="flex-col">
      <CodeLinksTable
        onLinkedCodes={setCodes}
        onNomenclature={setNomenclature}
      />
      <LinkedCodesTable linkedCodes={codes} nomenclature={nomenclature} />
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
