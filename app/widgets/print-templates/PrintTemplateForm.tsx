"use client";

import type { PrintTemplateFormValues } from "@/entities/print-template/model/schema";
import { printTemplateSchema } from "@/entities/print-template/model/schema";
import {
	fixedNomenclatureDetailsFields,
	getFixedNomenclatureDetailsTextFields,
	isNomenclatureDetailsLayout,
	templateFieldOptions,
	type EditableTemplateField,
} from "@/shared/lib/printingTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PrintingPreview from "./PrintingPreview";

type PreviewField = "" | EditableTemplateField;
type TemplateKind = "aggregation" | "nomenclature" | "nomenclatureDetails";

const DEFAULT_TEXT_FIELDS = Array.from({ length: 4 }, () => ({
	field: "",
	bold: false,
	size: 14,
}));

function hasSameTextFields(
	left: Array<{ field?: string; bold: boolean; size: number }>,
	right: Array<{ field?: string; bold: boolean; size: number }>,
) {
	return (
		left.length === right.length &&
		left.every(
			(field, index) =>
				field.field === right[index]?.field &&
				field.bold === right[index]?.bold &&
				field.size === right[index]?.size,
		)
	);
}

const PrintTemplateForm = () => {
	const [availableFields, setAvailableFields] = useState(templateFieldOptions);
	const router = useRouter();

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<PrintTemplateFormValues>({
		resolver: zodResolver(printTemplateSchema),
		defaultValues: {
			name: "",
			type: "aggregation",
			layout: "standard",
			qrType: "qr",
			qrPosition: "right",
			textFields: DEFAULT_TEXT_FIELDS,
			canvasSize: { width: "58mm", height: "40mm" },
		},
	});

	const templateType = watch("type");
	const layout = watch("layout");
	const qrPosition = watch("qrPosition");
	const watchedTextFields = watch("textFields");
	const textFields = useMemo(() => watchedTextFields ?? [], [watchedTextFields]);
	const canvasSize = watch("canvasSize") ?? { width: "58mm", height: "40mm" };
	const isDetailsLayout = isNomenclatureDetailsLayout(layout);
	const templateKind: TemplateKind =
		templateType === "aggregation"
			? "aggregation"
			: isDetailsLayout
				? "nomenclatureDetails"
				: "nomenclature";

	const previewTextFields = textFields.map((field) => ({
		...field,
		field: (field.field ?? "") as PreviewField,
	}));

	useEffect(() => {
		if (isDetailsLayout) {
			const nextFields = getFixedNomenclatureDetailsTextFields();
			if (qrPosition !== "right") {
				setValue("qrPosition", "right");
			}
			if (!hasSameTextFields(getValues("textFields") ?? [], nextFields)) {
				setValue("textFields", nextFields);
			}
			return;
		}

		if (qrPosition === "center") {
			const centerFields = [{ field: "name", bold: false, size: 14 }];
			if (!hasSameTextFields(getValues("textFields") ?? [], centerFields)) {
				setValue("textFields", centerFields);
			}
			return;
		}

		if (textFields.length !== 4) {
			setValue("textFields", DEFAULT_TEXT_FIELDS);
		}
	}, [getValues, isDetailsLayout, qrPosition, setValue, textFields.length]);

	useEffect(() => {
		if (isDetailsLayout || qrPosition === "center") {
			return;
		}

		const selectedFields = (getValues("textFields") ?? []).map((field) => field.field);
		setAvailableFields(
			templateFieldOptions.filter(
				(option) => !selectedFields.includes(option.value),
			),
		);
	}, [getValues, isDetailsLayout, qrPosition, textFields]);

	const handleTemplateKindChange = (nextTemplateKind: TemplateKind) => {
		const updateTemplateMeta = (
			nextType: PrintTemplateFormValues["type"],
			nextLayout: PrintTemplateFormValues["layout"],
		) => {
			setValue("type", nextType, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
			setValue("layout", nextLayout, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		};

		if (nextTemplateKind === "aggregation") {
			updateTemplateMeta("aggregation", "standard");
			return;
		}

		if (nextTemplateKind === "nomenclatureDetails") {
			updateTemplateMeta("nomenclature", "nomenclatureDetails");
			return;
		}

		updateTemplateMeta("nomenclature", "standard");
	};

	const onSubmit = async (data: PrintTemplateFormValues) => {
		const payload: PrintTemplateFormValues = isNomenclatureDetailsLayout(data.layout)
			? {
					...data,
					qrPosition: "right",
					textFields: getFixedNomenclatureDetailsTextFields(),
				}
			: data;

		try {
			const res = await fetch("/api/printing-templates", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (res.ok) {
				toast.success("Шаблон печати успешно создан");
				router.push("/print-templates");
			} else {
				const { error } = await res.json();
				toast.error(error);
			}
		} catch (error) {
			console.error("Ошибка при создании шаблона печати:", error);
			toast.error("Ошибка при создании шаблона печати");
		}
	};

	return (
		<form
			className="flex flex-col gap-4 p-4 w-full"
			onSubmit={handleSubmit(onSubmit)}
		>
			<input type="hidden" {...register("type")} />
			<input type="hidden" {...register("layout")} />
			<h1 className="text-xl font-bold">Новый шаблон печати</h1>

			<div className="p-4 border rounded-lg bg-white border-blue-600 space-y-4">
				<label htmlFor="name" className="font-bold">
					Название шаблона
				</label>
				<input
					{...register("name")}
					className="border rounded p-2 w-full"
					placeholder={
						isDetailsLayout ? "Условно номенклатура" : "Название шаблона"
					}
				/>
				{errors.name && <p className="text-red-500">{errors.name.message}</p>}

				<label className="font-bold">Тип этикетки:</label>
				<select
					value={templateKind}
					onChange={(e) =>
						handleTemplateKindChange(e.target.value as TemplateKind)
					}
					className="border rounded p-2 w-full"
				>
					<option value="aggregation">Агрегация</option>
					<option value="nomenclature">Номенклатура</option>
					<option value="nomenclatureDetails">Условно номенклатура</option>
				</select>

				<label className="font-bold">Тип кода:</label>
				<select {...register("qrType")} className="border rounded p-2 w-full">
					<option value="qr">QR</option>
					<option value="datamatrix">Data Matrix</option>
				</select>

				<label className="font-bold">Позиция кода:</label>
				<select
					{...register("qrPosition")}
					className="border rounded p-2 w-full"
					disabled={isDetailsLayout}
				>
					<option value="left">Слева</option>
					<option value="right">Справа</option>
					<option value="center">По центру</option>
				</select>

				<label className="font-bold">Размер этикетки:</label>
				<Controller
					control={control}
					name="canvasSize"
					render={({ field: { value, onChange } }) => (
						<select
							disabled
							className="border rounded p-2 w-full"
							value={JSON.stringify(value)}
							onChange={(e) => onChange(JSON.parse(e.target.value))}
						>
							<option value={JSON.stringify({ width: "58mm", height: "40mm" })}>
								58mm x 40mm
							</option>
						</select>
					)}
				/>
			</div>

			<div className="p-4 border rounded-lg bg-white border-blue-600">
				<label className="font-bold">Поля этикетки:</label>

				{isDetailsLayout ? (
					<p className="mt-2 text-sm text-gray-600">
						Фиксированный макет: Дата, Наименование, Бренд, Модель,
						Размер, Цвет, Изготовитель, Адрес, Сделано в Кыргызстане и
						Состав.
					</p>
				) : (
					textFields.map((_, index) => (
						<div key={index} className="flex items-center space-x-4 mt-2">
							<Controller
								name={`textFields.${index}.field`}
								control={control}
								render={({ field }) => {
									if (qrPosition === "center") {
										return (
											<select {...field} className="border rounded p-2 w-full">
												<option value="">Не выбрано</option>
												<option value="name">Наименование</option>
											</select>
										);
									}

									const currentValue = field.value ?? "";
									const selectedOption = templateFieldOptions.find(
										(option) => option.value === currentValue,
									);
									const optionsToRender =
										currentValue &&
										!availableFields.some(
											(option) => option.value === currentValue,
										) &&
										selectedOption
											? [selectedOption, ...availableFields]
											: availableFields;

									return (
										<select {...field} className="border rounded p-2 w-full">
											<option value="">Не выбрано</option>
											{optionsToRender.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									);
								}}
							/>
							<Controller
								name={`textFields.${index}.bold`}
								control={control}
								render={({ field }) => (
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={field.value}
											onChange={(e) => field.onChange(e.target.checked)}
										/>
										<span>Жирный</span>
									</label>
								)}
							/>
							<Controller
								name={`textFields.${index}.size`}
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="number"
										min="8"
										max="32"
										onChange={(e) => field.onChange(Number(e.target.value))}
										className="border rounded p-1 w-16 text-center"
									/>
								)}
							/>
						</div>
					))
				)}

				{isDetailsLayout && (
					<div className="mt-3 flex flex-wrap gap-2">
						{fixedNomenclatureDetailsFields.map((field) => (
							<span
								key={field.field}
								className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
							>
								{
									templateFieldOptions.find((option) => option.value === field.field)
										?.label
								}
							</span>
						))}
					</div>
				)}
			</div>

			<div className="w-full">
				<PrintingPreview
					textFields={previewTextFields}
					qrPosition={qrPosition}
					canvasSize={canvasSize}
					layout={layout}
				/>
			</div>

			<button
				type="submit"
				className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
			>
				Сохранить шаблон
			</button>
		</form>
	);
};

export default PrintTemplateForm;
