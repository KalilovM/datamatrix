"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

const CounteragentForm: React.FC = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		try {
			const res = await fetch("/api/counteragents", {
				method: "POST",
				body: formData,
			});
			if (res.ok) {
				toast.success("Контрагент успешно сохранена!");
				queryClient.invalidateQueries({
					queryKey: ["counteragents"],
				});
				queryClient.invalidateQueries({
					queryKey: ["counteragentOptions"],
				});
				router.push("/counteragents");
			} else {
				const data = await res.json();
				toast.error(data.error || "Произошла ошибка при сохранении.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Произошла ошибка при сохранении.");
		}
	};

	return (
		<div className="flex flex-col w-full h-full gap-4">
			<form className="gap-4 flex flex-col flex-1" onSubmit={handleSubmit}>
				<div className="flex items-center justify-between">
					<h1 className="leading-6 text-xl font-bold">Новый контрагент</h1>
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
				{/* Counteragents Fields */}
				<div className="flex flex-col flex-1 w-full rounded-lg border border-blue-300 bg-white px-8 py-3 items-center gap-4">
					<div className="flex flex-row w-full gap-4">
						<div className="w-1/2 flex flex-col">
							<label htmlFor="name" className="block">
								Наименование
							</label>
							<input
								name="name"
								type="text"
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
								className="w-full rounded-lg border px-3 py-2 text-gray-700"
							/>
						</div>
					</div>
					<div className="flex flex-row w-full gap-4">
						<div className="w-1/2 flex flex-col">
							<label htmlFor="modelArticle" className="block">
								КПП
							</label>
							<input
								name="kpp"
								type="text"
								className="w-full rounded-lg border px-3 py-2 text-gray-700"
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CounteragentForm;
