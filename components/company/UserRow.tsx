"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BinIcon, EditIcon } from "../Icons";
import { toast } from "react-toastify";
import { User } from "@/app/users/defenitions";
import Link from "next/link";

interface UserRowProps {
  user: User;
  onSelect: (id: string) => void;
  selectedCompanyId: string | null;
}

export default function UserRow({
  user,
  onSelect,
  selectedCompanyId,
}: UserRowProps) {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    onSelect(user.id);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_API_URL}/api/users/${user.id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Ошибка при удалении пользователя");
      } else {
        toast.success("Пользователь успешно удален");
        router.refresh();
      }
    } catch (err) {
      toast.error("Ошибка при удалении пользовалетя");
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
        className={`flex cursor-pointer items-center justify-between px-8 py-4 ${
          selectedCompanyId === user.id
            ? "bg-blue-100 text-blue-900"
            : "hover:bg-gray-100"
        }`}
        onClick={handleClick}
      >
        <div className="flex-1">{user.username}</div>
        <div className="flex-1 text-gray-600">{user.email}</div>
        <div className="flex shrink-0 flex-row items-center">
          <Link
            className="mr-4 bg-blue-500 px-2.5 py-2.5 text-white rounded-md"
            href={`/users/${user.id}/edit`}
          >
            <EditIcon className="size-5" />
          </Link>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 px-2.5 py-2.5 text-white rounded-md"
          >
            <BinIcon className="size-5" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-md bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Подтверждение удаления</h2>
            <p className="mb-6">
              Вы уверены, что хотите удалить пользователя &ldquo;{user.username}
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
