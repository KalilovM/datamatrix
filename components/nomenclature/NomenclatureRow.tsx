"use client";
import { useState } from "react";
import { Nomenclature } from "./NomenclatureTable";
import { useRouter } from "next/navigation";
import { BinIcon, EditIcon } from "../Icons";
import { toast } from "react-toastify";

interface NomenclatureRowProps {
  nomenclature: Nomenclature;
}

export default function NomenclatureRow({
  nomenclature,
}: NomenclatureRowProps) {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`nomenclature/${nomenclature.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/nomenclature/${nomenclature.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Ошибка при удалении номенклатуры");
      } else {
        toast.success("Номенклатура успешно удалена");
        router.refresh(); // refresh the list
      }
    } catch (err) {
      toast.error("Ошибка при удалении номенклатуры");
    } finally {
      setModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className={`flex cursor-pointer items-center justify-between px-8 py-4 hover:bg-gray-100`}
      >
        <div className="flex-1">{nomenclature.name}</div>
        <div className="flex-1 text-gray-600">{nomenclature.codeCount}</div>
        <div className="flex flex-shrink-0 flex-row items-center">
          <button
            onClick={handleEdit}
            className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md"
          >
            <EditIcon className="size-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 px-2.5 py-2.5 text-white rounded-md"
          >
            <BinIcon className="size-5" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-md bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Подтверждение удаления</h2>
            <p className="mb-6">
              Вы уверены, что хотите удалить номенклатуру &ldquo;
              {nomenclature.name}
              &rdquo;?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
