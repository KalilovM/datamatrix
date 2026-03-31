"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

const CompositionForm: React.FC = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		try {
			const res = await fetch("/api/compositions", {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				toast.success("Состав успешно сохранен!");
				queryClient.invalidateQueries({
					queryKey: ["compositions"],
				});
				router.push("/compositions");
				return;
			}

			const data = await res.json();
			toast.error(data.error || "Произошла ошибка при сохранении.");
		} catch (error) {
			console.error(error);
			toast.error("Произошла ошибка при сохранении.");
		}
	};

	return (
		<div className="flex h-full w-full flex-col gap-4">
			<form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit}>
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold leading-6">Новый состав</h1>
					<div className="flex flex-row gap-4">
						<Link
							href="/compositions"
							className="rounded-md bg-neutral-500 px-2.5 py-1.5 text-white"
						>
							Отмена
						</Link>
						<button
							type="submit"
							className="rounded-md bg-blue-500 px-2.5 py-1.5 text-white"
						>
							Сохранить
						</button>
					</div>
				</div>
				<div className="flex w-full flex-1 flex-col items-center gap-4 rounded-lg border border-blue-300 bg-white px-8 py-3">
					<div className="flex w-full flex-col">
						<label htmlFor="name" className="block">
							Название
						</label>
						<input
							name="name"
							type="text"
							required
							className="w-full rounded-lg border px-3 py-2 text-gray-700"
						/>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CompositionForm;
