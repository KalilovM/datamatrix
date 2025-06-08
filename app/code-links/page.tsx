"use client";

import { useState } from "react";
import { withRole } from "@/shared/configs/withRole";
import Layout from "@/shared/ui/Layout";
import CodeLinksTable from "./CodeLinksTable";
import LinkedCodesTable from "./LinkedCodesTable";

function CodeLinksPage() {
  const [codes, setCodes] = useState<string[]>([]);

  return (
    <Layout className="flex-col">
      <CodeLinksTable onLinkedCodes={setCodes} />
      <LinkedCodesTable linkedCodes={codes} />
    </Layout>
  );
}

export default withRole(CodeLinksPage, {
  allowedRoles: ["ADMIN", "COMPANY_ADMIN", "COMPANY_USER"],
});
