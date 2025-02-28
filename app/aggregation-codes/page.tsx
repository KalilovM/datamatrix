"use server";

import MainLayout from "@/components/MainLayout";
import { getAggregatedCodes } from "./actions";
import TableContent from "@/components/aggregation-codes/TableContent";

export default async function Page() {
  const aggregatedCodes = await getAggregatedCodes();

  return (
    <MainLayout>
      <TableContent aggregatedCodes={aggregatedCodes} />
    </MainLayout>
  );
}
