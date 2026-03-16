"use client"

import Layout from "@/shared/ui/Layout";
import { useCompanies } from "../hooks/useUser";
import UserCreateForm from "./form";

export default function Page() {
  const { data: companies, isLoading, isError, error } = useCompanies();

  if (isLoading) {
    return <Layout>Загрузка...</Layout>;
  }
  if (isError) {
    return <Layout>Произошла ошибка: {error?.message}</Layout>;
  }

  if (!companies) {
    return <Layout>Нет данных компаний</Layout>;
  }

  return (
    <Layout>
      <UserCreateForm companies={companies} />
    </Layout>
  );
}
