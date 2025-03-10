"use client";

import type React from "react";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CounteragentData {
	id: string;
	name: string;
	inn: string;
}

const CounteragentEditForm: React.FC<{ initialData: CounteragentData }> = ({
	initialData,
}) => {
	const [name, setName] = useState(initialData.name);
	const [inn, setInn] = useState(initialData.inn);

	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// Append the id to know which nomenclature to update.
		formData.append("id", initialData.id);
		formData.append("name", name);
		formData.append("inn", inn);

		try {
			const res = await fetch(`/api/counteragents/${initialData.id}`, {
				method: "PUT",
				body: formData,
			});
			if (res.ok) {
				toast.success("Контрагент успешно обновлен!");
				router.push("/counteragents");
			} else {
				const data = await res.json();
				toast.error(data.error || "Произошла ошибка при обновлении.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Произошла ошибка при обновлении.");
		}
	};

	return (
		<div className="flex flex-1 flex-col w-full h-full gap-4">
			<form onSubmit={handleSubmit} className="gap-4 flex flex-col flex-1">
				<div className="flex items-center justify-between">
					<h1 className="leading-6 text-xl font-bold">
						Редактирование контрагента
					</h1>
					<div className="flex flex-row gap-4">
						<Link
							href="/counteragents"
							className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md"
						>
							Отмена
						</Link>
						<button
							type="submit"
							className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
						>
							Сохранить
						</button>
					</div>
				</div>
				{/* Nomenclature Fields */}
				<div className="flex flex-col flex-1 w-full rounded-lg border border-blue-300 bg-white px-8 py-3 items-center gap-4">
					<div className="flex flex-row w-full gap-4">
						<div className="w-1/2 flex flex-col">
							<label htmlFor="name" className="block">
								Наименование
							</label>
							<input
								name="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="w-full rounded-lg border px-3 py-2 text-gray-700"
							/>
						</div>
						<div className="w-1/2 flex flex-col">
							<label htmlFor="modelArticle" className="block">
								ИНН
							</label>
							<input
								name="inn"
								type="text"
								value={inn}
								onChange={(e) => setInn(e.target.value)}
								className="w-full rounded-lg border px-3 py-2 text-gray-700"
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CounteragentEditForm;
