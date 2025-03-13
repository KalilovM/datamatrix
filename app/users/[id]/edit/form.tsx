"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateUser } from "./actions";
import { EditUserSchema } from "./schema";
import type { Company, FormData, User } from "./types";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
	user: User;
	companies: Company[];
}

export default function UserEditForm({ user, companies }: Props) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			email: user.email,
			username: user.username,
			role: user.role,
			companyId: user.companyId
				? {
						value: user.companyId,
						label: companies.find((c) => c.id === user.companyId)?.name || "",
					}
				: null,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: FormData) => updateUser(user.id, data),
		onSuccess: () => {
			toast.success("Пользователь обновлен успешно!");
			queryClient.invalidateQueries({
				queryKey: ["user", user.id],
			});
			router.push("/companies");
		},
		onError: () => {
			toast.error("Ошибка при обновлении пользователя");
		},
	});

	const onSubmit = (data: FormData) => {
		mutation.mutate(data);
	};

	return (
		<form className="table-layout" onSubmit={handleSubmit(onSubmit)}>
			<div className="table-header">
				<p className="table-header-title">Редактировать пользователя</p>
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
				{/* Email & Username */}
				<div className="w-full flex flex-row gap-16">
					<div className="w-1/2 flex flex-col">
						<label htmlFor="email">Электронная почта</label>
						<input
							{...register("email")}
							type="email"
							className={`w-full rounded-lg border px-3 py-2 ${
								errors.email ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>

					<div className="w-1/2 flex flex-col">
						<label htmlFor="username">Имя пользователя</label>
						<input
							{...register("username")}
							type="text"
							className={`w-full rounded-lg border px-3 py-2 ${
								errors.username ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.username && (
							<p className="text-sm text-red-500">{errors.username.message}</p>
						)}
					</div>
				</div>

				{/* Role & Company */}
				<div className="w-full flex flex-row gap-16">
					<div className="w-1/2 flex flex-col">
						<label htmlFor="role">Роль</label>
						<select
							{...register("role")}
							className={`w-full rounded-lg border px-3 py-2 ${
								errors.role ? "border-red-500" : "border-gray-300"
							}`}
						>
							<option value="ADMIN">Администратор</option>
							<option value="COMPANY_ADMIN">Админ фирмы</option>
							<option value="COMPANY_USER">Пользователь фирмы</option>
						</select>
						{errors.role && (
							<p className="text-sm text-red-500">{errors.role.message}</p>
						)}
					</div>

					<div className="w-1/2 flex flex-col">
						<label htmlFor="companyId">Компания</label>
						<Controller
							name="companyId"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									isClearable
									value={field.value}
									options={companies.map((company) => ({
										value: company.id,
										label: company.name,
									}))}
									placeholder="Выберите компанию"
								/>
							)}
						/>
						{errors.companyId && (
							<p className="text-sm text-red-500">{errors.companyId.message}</p>
						)}
					</div>
				</div>
			</div>
		</form>
	);
}
