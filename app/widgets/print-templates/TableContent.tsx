"use client";

import { usePrintTemplates } from "@/features/print-template/hooks/usePrintTemplates";
import Link from "next/link";
import PrintTemplateRow from "./PrintTemplateRow";

const TableContent: React.FC = () => {
	const { data: templates, isLoading, isError } = usePrintTemplates();

	if (isLoading) return <p>Загрузка шаблонов...</p>;
	if (isError) return <p>Ошибка при загрузке шаблонов</p>;

	return (
		<div className="table-layout">
			<div className="table-header">
				<p className="table-header-title">Шаблоны печати</p>
				<Link
					href="/print-templates/create"
					className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
				>
					Создать
				</Link>
			</div>
			<div className="relative overflow-x-auto sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" className="px-8 py-3">
								Наименование
							</th>
							<th scope="col" className="px-8 py-3">
								Дата
							</th>
							<th scope="col" className="px-8 py-3">
								Назначение
							</th>
							<th scope="col" className="px-8 py-3">
								<span className="sr-only">Назначение</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{templates?.map((template) => (
							<PrintTemplateRow key={template.id} template={template} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TableContent;
