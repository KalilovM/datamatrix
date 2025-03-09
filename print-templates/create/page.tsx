"use server";

import MainLayout from "@/components/MainLayout";
import LabelEditor from "@/components/print-templates/LabelTemplateEditor";

export default async function Page() {
  return (
    <MainLayout>
      <LabelEditor />
    </MainLayout>
  );
}
