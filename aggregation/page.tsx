"use server";

import MainLayout from "@/components/MainLayout";
import AggregationForm from "./components/AggregationForm";
import { getNomenclatureOptions } from "./actions";

export default async function Page() {
  const options = await getNomenclatureOptions();
  return (
    <MainLayout>
      <AggregationForm options={options} />
    </MainLayout>
  );
}
