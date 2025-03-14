"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { PrintTemplateData } from "../models/types";
import PrintingPreview from "./PrintingPreview";

enum TemplateFieldType {
	NAME = "name",
	MODEL_ARTICLE = "model_article",
	COLOR = "color",
	SIZE = "size",
}

const printRenamings = {
	model_article: "modelArticle",
	name: "name",
	color: "color",
	size: "size",
};

const fieldOptions = [
	{ value: TemplateFieldType.NAME, label: "Имя" },
	{ value: TemplateFieldType.MODEL_ARTICLE, label: "Модель" },
	{ value: TemplateFieldType.COLOR, label: "Цвет" },
	{ value: TemplateFieldType.SIZE, label: "Размер" },
];

interface EditPrintTemplateFormValues {
	name: string;
	type: "AGGREGATION" | "NOMENCLATURE";
	qrType: "QR" | "DATAMATRIX";
	qrPosition: "LEFT" | "RIGHT" | "CENTER";
	canvasSize: {
		width: string;
		height: string;
	};
	fields: {
		id?: string;
		fieldType: string;
		isBold: boolean;
		fontSize: number;
		order: number;
	}[];
}

interface PrintTemplateEditFormProps {
	initialData: PrintTemplateData;
}

const PrintTemplateEditForm = ({ initialData }: PrintTemplateEditFormProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	// Map initialData to our form shape.
	const defaultValues: EditPrintTemplateFormValues = {
		name: initialData.name,
		type: initialData.type,
		qrType: initialData.qrType,
		qrPosition: initialData.qrPosition,
		canvasSize: {
			width: initialData.width,
			height: initialData.height,
		},
		fields: initialData.fields
			.sort((a, b) => a.order - b.order)
			.map((field) => ({
				id: field.id,
				fieldType: field.fieldType.toLowerCase(),
				isBold: field.isBold,
				// Convert fontSize from string to number for the input.
				fontSize: Number(field.fontSize),
				order: field.order,
			})),
	};

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

	const qrPosition = watch("qrPosition");
	const fields = watch("fields");
	const canvasSize = watch("canvasSize");

	// Manage field count and defaults based on QR position.
	useEffect(() => {
		console.log(defaultValues);
		if (qrPosition === "CENTER") {
			// When in CENTER mode, only allow one field (with "Имя")
			setValue("fields", [
				{
					id: defaultValues.fields[0]?.id || "",
					fieldType: TemplateFieldType.NAME,
					isBold: false,
					fontSize: 14,
					order: 1,
				},
			]);
		} else {
			// For LEFT/RIGHT, if we don't have 4 fields then set a default array.
			if (fields.length !== 4) {
				setValue(
					"fields",
					Array(4)
						.fill(0)
						.map((_, index) => ({
							id: defaultValues.fields[index]?.id || "",
							fieldType: defaultValues.fields[index]?.fieldType || "",
							isBold: defaultValues.fields[index]?.isBold || false,
							fontSize: defaultValues.fields[index]?.fontSize || 14,
							order: defaultValues.fields[index]?.order || index + 1,
						})),
				);
			}
		}
	}, [qrPosition, setValue, fields.length, defaultValues.fields]);

	// Update available fields options when not in CENTER mode.
	const [availableFields, setAvailableFields] = useState(fieldOptions);
	useEffect(() => {
		console.log(fields);
		if (qrPosition !== "CENTER") {
			const selectedFields = getValues("fields").map((f) => f.fieldType);
			setAvailableFields(
				fieldOptions.filter((opt) => !selectedFields.includes(opt.value)),
			);
		}
	}, [fields, getValues, qrPosition]);

	const onSubmit = async (data: EditPrintTemplateFormValues) => {
		try {
			const res = await fetch(
				`/api/printing-templates/${initialData.id}/edit`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
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
				<select {...register("type")} className="border rounded p-2 w-full">
					<option value="AGGREGATION">Агрегация</option>
					<option value="NOMENCLATURE">Номенклатура</option>
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
							<option
								value={JSON.stringify({
									width: value.width,
									height: value.height,
								})}
							>
								{value.width} x {value.height}
							</option>
						</select>
					)}
				/>
			</div>

			<div className="p-4 border rounded-lg bg-white border-blue-600">
				<label className="font-bold">Выберите текстовые поля:</label>
				{fields.map((_, index) => (
					<div key={index} className="flex items-center space-x-4 mt-2">
						<Controller
							name={`fields.${index}.fieldType`}
							control={control}
							render={({ field }) => {
								const currentValue = field.value;
								// In CENTER mode, only allow "Имя"
								if (qrPosition === "CENTER") {
									return (
										<select {...field} className="border rounded p-2 w-full">
											<option value="">Не выбрано</option>
											<option value={TemplateFieldType.NAME}>Имя</option>
										</select>
									);
								}
								// For LEFT/RIGHT, combine available options with the currently selected value if missing.
								const selectedOption = fieldOptions.find(
									(opt) => opt.value === currentValue,
								);

								const optionsToRender =
									currentValue &&
									!availableFields.some((opt) => opt.value === currentValue) &&
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
				))}
			</div>

			<div className="w-full h-full">
				<PrintingPreview
					textFields={fields.map((f) => ({
						field: printRenamings[f.fieldType],
						bold: f.isBold,
						size: f.fontSize,
					}))}
					qrPosition={qrPosition}
					canvasSize={{
						width: `${canvasSize.width}mm`,
						height: `${canvasSize.height}mm`,
					}}
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
