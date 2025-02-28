"use server";

import MainLayout from "@/components/MainLayout";
import { getCounteragentOptions } from "./actions";
import OrderCreationForm from "@/components/orders/OrderCreationForm";

export default async function Page() {
  const counteragentOptions = await getCounteragentOptions();
  return (
    <MainLayout>
      <OrderCreationForm counteragentOptions={counteragentOptions} />
    </MainLayout>
  );
}
