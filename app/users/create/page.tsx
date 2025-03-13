"use client"

import Layout from "@/shared/ui/Layout";
import { useCompanies } from "../hooks/useUser";
import UserCreateForm from "./form";

export default function Page() {
  const {data: companies, isLoading, isError} = useCompanies();

  if (isLoading) {
    return <Layout>Загрузка...</Layout>;
  }
  if (isError) {
    return <Layout>Произошла ошибка: {isError.message}</Layout>;
  }

	return (
		<Layout>
			<UserCreateForm companies={companies} />
		</Layout>
	);
}
