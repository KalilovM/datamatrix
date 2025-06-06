"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateCompany } from "./actions";
import { EditCompanySchema } from "./schema";
import type { Company, FormData, User } from "./types";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
	users: User[];
	company: Company;
}

export default function CompanyEditForm({ users, company }: Props) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(EditCompanySchema),
		defaultValues: {
			name: company.name,
			subscriptionEnd: company.subscriptionEnd.toISOString().split("T")[0],
			token: company.token,
			users: company.users.map((user) => user.id),
		},
	});

	const mutation = useMutation({
		mutationFn: (data: FormData) => updateCompany(company.id, data),
		onSuccess: () => {
			toast.success("Компания обновлена успешно!");
			queryClient.invalidateQueries({
				queryKey: ["companies"],
			});
			router.push("/companies");
		},
		onError: () => {
			toast.error("Ошибка при обновлении компании");
		},
	});

	const onSubmit = (data: FormData) => {
		mutation.mutate(data);
	};

	return (
		<form className="table-layout" onSubmit={handleSubmit(onSubmit)}>
			<div className="table-header">
				<p className="table-header-title">Редактировать компанию</p>
				<div className="flex gap-3">
					<button
						type="button"
						className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md cursor-pointer"
						onClick={() => router.push("/companies")}
					>
						Отмена
					</button>
					<button
						type="submit"
						className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md cursor-pointer"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Сохранение..." : "Сохранить"}
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-4 px-8 py-3">
				<div className="w-full flex flex-row gap-16">
					{/* Наименование */}
					<div className="w-1/2 flex flex-col">
						<label htmlFor="name">Наименование</label>
						<input
							{...register("name")}
							type="text"
							className={`w-full rounded-lg border px-3 py-2 ${
								errors.name ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* Дата окончания подписки */}
					<div className="w-1/2 flex flex-col">
						<label htmlFor="subscriptionEnd">Дата окончания подписки</label>
						<input
							{...register("subscriptionEnd")}
							type="date"
							className={`w-full rounded-lg border px-3 py-2 ${
								errors.subscriptionEnd ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.subscriptionEnd && (
							<p className="text-sm text-red-500">
								{errors.subscriptionEnd.message}
							</p>
						)}
					</div>
				</div>

				{/* Токен и Администраторы */}
				<div className="w-full flex flex-row gap-16">
					<div className="w-1/2 flex flex-col">
						<label htmlFor="token">Токен компании</label>
						<input
							{...register("token")}
							type="text"
							readOnly
							className="w-full rounded-lg border px-3 py-2 bg-gray-100"
						/>
					</div>

					<div className="w-1/2 flex flex-col">
						<label htmlFor="users">Администраторы</label>
						<Controller
							name="users"
							control={control}
							render={({ field }) => (
								<Select
									isMulti
									options={users.map((user) => ({
										value: user.id,
										label: user.username,
									}))}
									value={users
										.filter((user) => field.value.includes(user.id))
										.map((user) => ({ value: user.id, label: user.username }))}
									onChange={(newValue) =>
										field.onChange(newValue.map((option) => option.value))
									}
									placeholder="Выберите администраторов"
									noOptionsMessage={() => "Нет доступных администраторов"}
								/>
							)}
						/>
						{errors.users && (
							<p className="text-sm text-red-500">{errors.users.message}</p>
						)}
					</div>
				</div>
			</div>
		</form>
	);
}
