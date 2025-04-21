"use client";

import { useGtinSizeStore } from "@/nomenclature/stores/sizegtinStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateNomenclature } from "../../model/actions";
import {
	type NomenclatureEditData,
	NomenclatureEditSchema,
} from "../../model/schema";
import { useNomenclatureStore } from "../../model/store";
import CodeTable from "./CodeTable";
import ConfigurationTable from "./ConfigurationTable";
import { SizeGtinTable } from "./SizeGtinTable";

type IGtinSize = {
	id: string;
	size: string;
	GTIN: string;
};

interface Props {
	nomenclature: NomenclatureEditData;
}

export default function NomenclatureEditForm({ nomenclature }: Props) {
	const [initialData, setInitialData] = useState<NomenclatureEditData | null>(
		null,
	);
	const { setNomenclature } = useNomenclatureStore();
	const { setGtinSize, reset: resetSizes, gtinSize } = useGtinSizeStore();
	const { reset } = useNomenclatureStore();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset: resetForm,
		formState: { errors },
		control,
		setValue,
		watch,
	} = useForm<NomenclatureEditData>({
		resolver: zodResolver(NomenclatureEditSchema),
		defaultValues: initialData || undefined,
	});

	const codes = watch("codes");

	useEffect(() => {
		if (nomenclature) {
			console.log(nomenclature);
			setGtinSize(nomenclature.sizeGtin);

			setInitialData(nomenclature);
			setNomenclature(nomenclature);
			resetForm(nomenclature);
		}
	}, [nomenclature, resetForm, setGtinSize, setNomenclature]);

	const mutation = useMutation({
		mutationFn: updateNomenclature,
		onSuccess: () => {
			toast.success("Номенклатура сохранена!");
			reset();
			resetSizes();
			router.push("/nomenclature");
		},
		onError: (error) => {
			toast.error(error.message || "Произошла ошибка");
		},
	});

	const onSubmit = (data: NomenclatureEditData) => {
		const payload = {
			...data,
			gtinSize,
		};
		console.log(payload);
		mutation.mutate(payload);
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
			console.log("Old codes:", codes);
			console.log("Updated codes:", updatedCodes);
			const { updateGtinSize, addGtinSize } = useGtinSizeStore.getState();

			if (oldGtin !== undefined && oldSize !== undefined) {
				updateGtinSize(oldGtin, oldSize, newGtinSize);
			} else {
				addGtinSize(newGtinSize);
			}
		}
	};

	const handleCancel = () => {
		reset();
		resetSizes();
		router.push("/nomenclature");
	};

	return (
		<form
			className="flex flex-col w-full h-full gap-4 print:hidden"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="table-layout h-auto">
				<div className="table-header">
					<p className="table-header-title">
						{nomenclature
							? "Редактирование номенклатуры"
							: "Новая номенклатура"}
					</p>
					<div className="flex gap-3">
						<button
							type="button"
							className="bg-neutral-500 px-2.5 py-1.5 text-white rounded-md cursor-pointer"
							onClick={handleCancel}
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
					{/* Наименование */}
					<div className="flex flex-col">
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

					{/* Row for Модель/Артикул, Цвет, and Размер */}
					<div className="flex flex-row gap-4">
						{/* Модель/Артикул */}
						<div className="flex flex-col flex-1">
							<label htmlFor="modelArticle">Модель</label>
							<input
								{...register("modelArticle")}
								type="text"
								className={`w-full rounded-lg border px-3 py-2 ${
									errors.modelArticle ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.modelArticle && (
								<p className="text-sm text-red-500">
									{errors.modelArticle.message}
								</p>
							)}
						</div>

						{/* Цвет */}
						<div className="flex flex-col flex-1">
							<label htmlFor="color">Цвет</label>
							<input
								{...register("color")}
								type="text"
								className={`w-full rounded-lg border px-3 py-2 ${
									errors.color ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.color && (
								<p className="text-sm text-red-500">{errors.color.message}</p>
							)}
						</div>
					</div>
				</div>

				{/* Tables for Configurations and Codes */}
			</div>
			<div className="flex flex-row w-full gap-4 h-full flex-1 min-h-[400px] max-h-[400px]">
				<Controller
					control={control}
					name="configurations"
					render={({ field: { value, onChange } }) => (
						<ConfigurationTable value={value} onChange={onChange} />
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
