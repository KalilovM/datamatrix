"use client";

import { useCompositions } from "@/features/compositions/hooks/useCompositions";
import { useConfigurationsStore } from "@/nomenclature/stores/configurationsStore";
import { useGtinSizeStore } from "@/nomenclature/stores/sizegtinStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createNomenclature } from "../../model/actions";
import {
	type NomenclatureFormData,
	NomenclatureSchema,
} from "../../model/schema";
import { useNomenclatureStore } from "../../model/store";
import CodeTable from "./CodeTable";
import ConfigurationTable from "./ConfigurationTable";
import { SizeGtinTable } from "./SizeGtinTable";

type IGtinSize = {
	id: string | null;
	size: number;
	GTIN: string;
};

export default function NomenclatureForm() {
	const { reset } = useNomenclatureStore();
	const { reset: resetSizes, gtinSize } = useGtinSizeStore();
	const resetConfigurations = useConfigurationsStore((state) => state.reset);
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: compositions = [], isLoading: isCompositionsLoading } =
		useCompositions();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		control,
		watch,
	} = useForm<NomenclatureFormData>({
		resolver: zodResolver(NomenclatureSchema),
		defaultValues: {
			codes: [],
		},
	});
	const codes = watch("codes");

	const mutation = useMutation({
		mutationFn: createNomenclature,
		onSuccess: (response) => {
			if (!response.success) {
				toast.error(response.error || "Произошла ошибка");
				return;
			}

			if (!response.data) {
				toast.error("Не удалось получить данные созданной номенклатуры");
				return;
			}

			toast.success("Номенклатура сохранена!");
			reset();
			resetSizes();
			queryClient.invalidateQueries({ queryKey: ["nomenclatures"] });
			queryClient.invalidateQueries({ queryKey: ["nomenclaturesOptions"] });
			router.push(`/nomenclature/${response.data.id}/edit`);
		},
		onError: () => {
			toast.error("Произошла ошибка при выполнении запроса");
		},
	});

	useEffect(() => {
		resetConfigurations();
	}, [resetConfigurations]);

	const onSubmit = (data: NomenclatureFormData) => {
		const payloadWithGtinSize = {
			...data,
			gtinSize: gtinSize.map((item) => ({
				id: item.id ?? undefined,
				size: Number(item.size),
				GTIN: item.GTIN,
			})),
		};
		mutation.mutate(payloadWithGtinSize);
	};

	const handleCancel = () => {
		reset();
		resetSizes();
		router.push("/nomenclature");
	};

	const handleSaveGtinSize = (
		newGtinSize: IGtinSize,
		oldGtin?: string,
		oldSize?: number,
	) => {
		if (codes && Array.isArray(codes)) {
			const updatedCodes = codes.map((code) => {
				if (code.GTIN === oldGtin && Number.parseInt(code.size) === oldSize) {
					return {
						...code,
						GTIN: newGtinSize.GTIN,
						size: String(newGtinSize.size),
					};
				}
				return code;
			});

			setValue("codes", updatedCodes);
			const { updateGtinSize, addGtinSize } = useGtinSizeStore.getState();

			if (oldGtin !== undefined && oldSize !== undefined) {
				updateGtinSize(oldGtin, oldSize, newGtinSize);
			} else {
				addGtinSize(newGtinSize);
			}
		}
	};

	return (
		<form
			className="flex w-full flex-col gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="table-layout h-auto">
				<div className="table-header">
					<p className="table-header-title">Новая номенклатура</p>
					<div className="flex gap-3">
						<button
							type="button"
							className="cursor-pointer rounded-md bg-neutral-500 px-2.5 py-1.5 text-white"
							onClick={handleCancel}
						>
							Отмена
						</button>
						<button
							type="submit"
							className="cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-white"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? "Сохранение..." : "Сохранить"}
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-4 px-8 py-3">
					<div className="flex flex-col">
						<label htmlFor="name">Наименование</label>
						<input
							{...register("name")}
							type="text"
							className={`w-full rounded-lg border px-2 py-1 ${
								errors.name ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					<div className="flex flex-row gap-4">
						<div className="flex flex-1 flex-col">
							<label htmlFor="modelArticle">Модель</label>
							<input
								{...register("modelArticle")}
								type="text"
								className={`w-full rounded-lg border px-2 py-1 ${
									errors.modelArticle ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.modelArticle && (
								<p className="text-sm text-red-500">
									{errors.modelArticle.message}
								</p>
							)}
						</div>

						<div className="flex flex-1 flex-col">
							<label htmlFor="color">Цвет</label>
							<input
								{...register("color")}
								type="text"
								className={`w-full rounded-lg border px-2 py-1 ${
									errors.color ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.color && (
								<p className="text-sm text-red-500">{errors.color.message}</p>
							)}
						</div>
					</div>

					<div className="flex flex-col">
						<label htmlFor="compositionId">Состав</label>
						<select
							{...register("compositionId")}
							className="w-full rounded-lg border border-gray-300 px-2 py-1"
							disabled={isCompositionsLoading}
						>
							<option value="">
								{isCompositionsLoading ? "Загрузка составов..." : "Не выбрано"}
							</option>
							{compositions.map((composition) => (
								<option key={composition.id} value={composition.id}>
									{composition.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			<div className="flex h-full min-h-[300px] max-h-[300px] w-full flex-1 flex-row gap-4">
				<Controller
					control={control}
					name="configurations"
					render={({ field: { onChange } }) => (
						<ConfigurationTable onChange={onChange} />
					)}
				/>

				<SizeGtinTable onSaveGtinSize={handleSaveGtinSize} />
			</div>
			<Controller
				control={control}
				name="codes"
				render={({ field: { value, onChange } }) => (
					<CodeTable value={value} onChange={onChange} />
				)}
			/>
		</form>
	);
}
