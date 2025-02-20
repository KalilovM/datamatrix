"use server";

import MainLayout from "@/components/MainLayout";
import AggregationForm from "@/components/aggregation/AggregationForm";
import getNomenclatureOptions from "./actions";

export default async function Page() {
  const options = await getNomenclatureOptions();
  return (
    <MainLayout>
      <AggregationForm options={options} />
    </MainLayout>
  );
}
