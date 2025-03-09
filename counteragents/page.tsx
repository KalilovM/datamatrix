"use server";
import { getCounteragents } from "./actions";
import MainLayout from "@/components/MainLayout";
import CounteragentRow from "@/components/counteragents/CounteragentRow";
import Link from "next/link";

export default async function Page() {
  const counteragents = await getCounteragents();
  return (
    <MainLayout>
      <div className="table-layout">
        <div className="table-header">
          <p className="table-header-title">Контрагенты</p>
          <Link
            className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
            href="/counteragents/create"
          >
            Создать
          </Link>
        </div>
        <div className="table-rows-layout">
          {counteragents.map((counteragent) => (
            <CounteragentRow
              key={counteragent.id}
              counteragent={counteragent}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
