"use server";

import { IPrintTemplate } from "@/app/print-templates/definitions";
import PrintTemplateRow from "./PrintTemplateRow";
import Link from "next/link";

interface ITableContentProps {
  templates: IPrintTemplate[];
}

export default async function TableContent({ templates }: ITableContentProps) {
  return (
    <div className="table-layout">
      {/* Table Header */}
      <div className="table-header">
        <p className="table-header-title">Шаблоны печати</p>
        <Link
          href="/print-templates/create"
          className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
        >
          Создать
        </Link>
      </div>

      {/* Table Columns */}
      <PrintTemplateRow templates={templates} />
    </div>
  );
}
