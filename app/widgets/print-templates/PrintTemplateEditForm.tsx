"use client";

import type { PrintTemplateData } from "@/print-templates/models/types";
import {
	fixedNomenclatureDetailsFields,
	isNomenclatureDetailsLayout,
	normalizeEditableFieldType,
	templateFieldOptions,
	type EditableTemplateField,
} from "@/shared/lib/printingTemplate";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PrintingPreview from "./PrintingPreview";

interface EditPrintTemplateFormValues {
	name: string;
	type: "AGGREGATION" | "NOMENCLATURE";
	layout: "STANDARD" | "NOMENCLATURE_DETAILS";
	qrType: "QR" | "DATAMATRIX";
	qrPosition: "LEFT" | "RIGHT" | "CENTER";
	canvasSize: {
		width: string;
		height: string;
	};
	fields: {
		id?: string;
		fieldType: EditableTemplateField | "";
		isBold: boolean;
		fontSize: number;
		order: number;
	}[];
}

type EditTemplateKind =
	| "AGGREGATION"
	| "NOMENCLATURE"
	| "NOMENCLATURE_DETAILS";

interface PrintTemplateEditFormProps {
	initialData: PrintTemplateData;
}

function hasSameFields(
	left: EditPrintTemplateFormValues["fields"],
	right: EditPrintTemplateFormValues["fields"],
) {
	return (
		left.length === right.length &&
		left.every(
			(field, index) =>
				field.id === right[index]?.id &&
				field.fieldType === right[index]?.fieldType &&
				field.isBold === right[index]?.isBold &&
				field.fontSize === right[index]?.fontSize &&
				field.order === right[index]?.order,
		)
	);
}

const PrintTemplateEditForm = ({
	initialData,
}: PrintTemplateEditFormProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const defaultValues: EditPrintTemplateFormValues = useMemo(
		() => ({
			name: initialData.name,
			type: initialData.type,
			layout: initialData.layout ?? "STANDARD",
			qrType: initialData.qrType,
			qrPosition: initialData.qrPosition,
			canvasSize: {
				width: String(initialData.width),
				height: String(initialData.height),
			},
			fields: [...initialData.fields]
				.sort((a, b) => a.order - b.order)
				.map((field) => ({
					id: field.id,
					fieldType: normalizeEditableFieldType(field.fieldType),
					isBold: field.isBold,
					fontSize: Number(field.fontSize),
					order: field.order,
				})),
		}),
		[initialData],
	);

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<EditPrintTemplateFormValues>({
		defaultValues,
	});

	const [availableFields, setAvailableFields] = useState(templateFieldOptions);
	const templateType = watch("type");
	const layout = watch("layout");
	const qrPosition = watch("qrPosition");
	const fields = watch("fields");
	const canvasSize = watch("canvasSize");
	const isDetailsLayout = isNomenclatureDetailsLayout(layout);
	const templateKind: EditTemplateKind =
		templateType === "AGGREGATION"
			? "AGGREGATION"
			: isDetailsLayout
				? "NOMENCLATURE_DETAILS"
				: "NOMENCLATURE";

	const buildFixedDetailFields = useCallback(() => {
		const existingFields = new Map(
			(getValues("fields") ?? []).map((field) => [field.fieldType, field]),
		);

		return fixedNomenclatureDetailsFields.map((field, index) => ({
			id: existingFields.get(field.field)?.id ?? "",
			fieldType: field.field,
			isBold: existingFields.get(field.field)?.isBold ?? field.bold,
			fontSize: existingFields.get(field.field)?.fontSize ?? field.size,
			order: index + 1,
		}));
	}, [getValues]);

	useEffect(() => {
		if (templateType !== "NOMENCLATURE" && layout !== "STANDARD") {
			setValue("layout", "STANDARD");
		}
	}, [layout, setValue, templateType]);

	useEffect(() => {
		if (isDetailsLayout) {
			if (qrPosition !== "RIGHT") {
				setValue("qrPosition", "RIGHT");
			}

			const detailFields = buildFixedDetailFields();
			if (!hasSameFields(getValues("fields") ?? [], detailFields)) {
				setValue("fields", detailFields);
			}
			return;
		}

		if (qrPosition === "CENTER") {
			const currentFields = getValues("fields") ?? [];
			const centerFields = [
				{
					id: currentFields[0]?.id ?? "",
					fieldType: "name" as const,
					isBold: false,
					fontSize: 14,
					order: 1,
				},
			];
			if (!hasSameFields(currentFields, centerFields)) {
				setValue("fields", centerFields);
			}
			return;
		}

		if (fields.length !== 4) {
			const nextFields: EditPrintTemplateFormValues["fields"] = Array.from(
				{ length: 4 },
				(_, index) => ({
					id: defaultValues.fields[index]?.id || "",
					fieldType:
						(defaultValues.fields[index]?.fieldType as
							| EditableTemplateField
							| "") || "",
					isBold: defaultValues.fields[index]?.isBold || false,
					fontSize: defaultValues.fields[index]?.fontSize || 14,
					order: defaultValues.fields[index]?.order || index + 1,
				}),
			);
			setValue("fields", nextFields);
		}
	}, [
		defaultValues.fields,
		fields.length,
		getValues,
		isDetailsLayout,
		qrPosition,
		setValue,
		buildFixedDetailFields,
	]);

	useEffect(() => {
		if (isDetailsLayout || qrPosition === "CENTER") {
			return;
		}

		const selectedFields = (getValues("fields") ?? []).map(
			(field) => field.fieldType,
		);
		setAvailableFields(
			templateFieldOptions.filter(
				(option) => !selectedFields.includes(option.value),
			),
		);
	}, [fields, getValues, isDetailsLayout, qrPosition]);

	const handleTemplateKindChange = (nextTemplateKind: EditTemplateKind) => {
		if (nextTemplateKind === "AGGREGATION") {
			setValue("type", "AGGREGATION");
			setValue("layout", "STANDARD");
			return;
		}

		if (nextTemplateKind === "NOMENCLATURE_DETAILS") {
			setValue("type", "NOMENCLATURE");
			setValue("layout", "NOMENCLATURE_DETAILS");
			return;
		}

		setValue("type", "NOMENCLATURE");
		setValue("layout", "STANDARD");
	};

	const onSubmit = async (data: EditPrintTemplateFormValues) => {
		const payload = isNomenclatureDetailsLayout(data.layout)
			? {
					...data,
					qrPosition: "RIGHT" as const,
					fields: buildFixedDetailFields(),
				}
			: data;

		try {
			const res = await fetch(
				`/api/printing-templates/${initialData.id}/edit`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);
			if (res.ok) {
				toast.success("Шаблон печати успешно обновлен");
				queryClient.invalidateQueries({
					queryKey: ["printingTemplatesEdit", initialData.id],
				});
				router.push("/print-templates");
			} else {
				const { error } = await res.json();
				toast.error(error);
			}
		} catch (error) {
			console.error("Ошибка при обновлении шаблона печати:", error);
			toast.error("Ошибка при обновлении шаблона печати");
		}
	};

	return (
		<form
			className="flex flex-col gap-4 p-4 w-full"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1 className="text-xl font-bold">Редактировать шаблон печати</h1>

			<div className="p-4 border rounded-lg bg-white border-blue-600 space-y-4">
				<label htmlFor="name" className="font-bold">
					Название шаблона
				</label>
				<input {...register("name")} className="border rounded p-2 w-full" />
				{errors.name && <p className="text-red-500">{errors.name.message}</p>}

				<label className="font-bold">Тип этикетки:</label>
				<select
					value={templateKind}
					onChange={(e) =>
						handleTemplateKindChange(e.target.value as EditTemplateKind)
					}
					className="border rounded p-2 w-full"
				>
					<option value="AGGREGATION">Агрегация</option>
					<option value="NOMENCLATURE">Номенклатура</option>
					<option value="NOMENCLATURE_DETAILS">Условно номенклатура</option>
				</select>

				<label className="font-bold">Тип кода:</label>
				<select {...register("qrType")} className="border rounded p-2 w-full">
					<option value="QR">QR</option>
					<option value="DATAMATRIX">Data Matrix</option>
				</select>

				<label className="font-bold">Позиция кода:</label>
				<select
					{...register("qrPosition")}
					className="border rounded p-2 w-full"
					disabled={isDetailsLayout}
				>
					<option value="LEFT">Слева</option>
					<option value="RIGHT">Справа</option>
					<option value="CENTER">По центру</option>
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
							<option value={JSON.stringify(value)}>
								{value.width} x {value.height}
							</option>
						</select>
					)}
				/>
			</div>

			<div className="p-4 border rounded-lg bg-white border-blue-600">
				<label className="font-bold">Поля этикетки:</label>

				{isDetailsLayout ? (
					<>
						<p className="mt-2 text-sm text-gray-600">
							Фиксированный макет: Дата, Наименование, Бренд, Модель,
							Размер, Цвет, Изготовитель, Адрес, Сделано в Кыргызстане и
							Состав.
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{fixedNomenclatureDetailsFields.map((field) => (
								<span
									key={field.field}
									className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
								>
									{
										templateFieldOptions.find(
											(option) => option.value === field.field,
										)?.label
									}
								</span>
							))}
						</div>
					</>
				) : (
					fields.map((_, index) => (
						<div key={index} className="flex items-center space-x-4 mt-2">
							<Controller
								name={`fields.${index}.fieldType`}
								control={control}
								render={({ field }) => {
									if (qrPosition === "CENTER") {
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
								name={`fields.${index}.isBold`}
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
								name={`fields.${index}.fontSize`}
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
			</div>

			<div className="w-full h-full">
				<PrintingPreview
					textFields={fields.map((field) => ({
						field: field.fieldType,
						bold: field.isBold,
						size: field.fontSize,
					}))}
					qrPosition={qrPosition}
					canvasSize={{
						width: `${canvasSize.width}mm`,
						height: `${canvasSize.height}mm`,
					}}
					layout={layout}
				/>
			</div>

			<button
				type="submit"
				className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
			>
				Сохранить изменения
			</button>
		</form>
	);
};

export default PrintTemplateEditForm;
