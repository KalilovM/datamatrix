import MainLayout from "@/components/MainLayout";
import { getCounteragentById } from "./actions";
import CounteragentEditForm from "@/components/counteragents/CounteagentEditForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const counteragentId = (await params).id;
  const counteragent = await getCounteragentById(counteragentId);

  if (!counteragent) {
    return (
      <MainLayout>
        <p>Контрагент не найдена</p>
      </MainLayout>
    );
  }

  const initialData = {
    id: counteragent.id,
    name: counteragent.name,
    inn: counteragent.inn,
  };

  return (
    <MainLayout>
      <CounteragentEditForm initialData={initialData} />
    </MainLayout>
  );
}
