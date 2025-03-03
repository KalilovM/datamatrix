"use server";

import MainLayout from "@/components/MainLayout";
import { getAggregatedCodes, getDefaultPrintTemplate } from "./actions";
import TableContent from "@/components/aggregation-codes/TableContent";

export default async function Page() {
  const aggregatedCodes = await getAggregatedCodes();
  const defaultTemplate = await getDefaultPrintTemplate();

  return (
    <MainLayout>
      <TableContent
        aggregatedCodes={aggregatedCodes}
        defaultTemplate={defaultTemplate}
      />
    </MainLayout>
  );
}
