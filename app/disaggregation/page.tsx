"use server";

import DisaggregationForm from "@/components/disaggregation/DisaggregationForm";
import MainLayout from "@/components/MainLayout";

export default async function Page() {
  return (
    <MainLayout>
      <DisaggregationForm />
    </MainLayout>
  );
}
