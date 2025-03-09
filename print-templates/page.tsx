"use server";

import MainLayout from "@/components/MainLayout";
import { getPrintTemplates } from "./actions";
import TableContent from "@/components/print-templates/TableContent";

export default async function Page() {
  const printTemplates = await getPrintTemplates();

  return (
    <MainLayout>
      <TableContent templates={printTemplates} />
    </MainLayout>
  );
}
