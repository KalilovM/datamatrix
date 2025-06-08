"use client";

import { IPrintTemplate } from "@/app/print-templates/definitions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PrintTemplateRow({
  templates,
}: {
  templates: IPrintTemplate[];
  onDefaultChange: (id: string) => void;
}) {
  // Function to mark a template as default
  const router = useRouter();
  const handleMakeDefault = async (templateId: string) => {
    try {
      const res = await fetch("/api/printing-template/default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: templateId }),
      });
      if (res.ok) {
        toast.success("Шаблон успешно установлен по умолчанию");
        router.refresh();
      } else {
        toast.error((await res.json()).error);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Ошибка при установке шаблона по умолчанию");
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        {/* Table Header */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-8 py-3">
              Наименование
            </th>
            <th scope="col" className="px-8 py-3">
              Дата
            </th>
            <th scope="col" className="px-8 py-3">
              <span className="sr-only">Действие</span>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {templates.map((template) => (
            <tr
              key={template.id}
              className="bg-white border-b border-gray-200 hover:bg-gray-50"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {template.name}
              </th>
              <td className="px-6 py-4">
                {new Date(template.createdAt).toLocaleDateString("ru-RU")}
              </td>
              <td className="px-6 py-4 text-right">
                {template.isDefault ? (
                  <span className="text-green-600 font-bold">По умолчанию</span>
                ) : (
                  <button
                    onClick={() => handleMakeDefault(template.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
                  >
                    Сделать по умолчанию
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
