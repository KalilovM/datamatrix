"use client";

import type { PrintTemplateData } from "@/print-templates/models/types";
import {
	fixedNomenclatureDetailsFields,
	templateFieldOptions,
	type EditableTemplateField,
} from "@/shared/lib/printingTemplate";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

const DEFAULT_FIELDS: EditPrintTemplateFormValues["fields"] = Array.from(
	{ length: 4 },
	(_, index) => ({
		id: "",
		fieldType: "",
		isBold: false,
		fontSize: 14,
		order: index + 1,
	}),
);

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

function getTemplateKind(initialData: PrintTemplateData): EditTemplateKind {
	if (initialData.type === "AGGREGATION") {
		return "AGGREGATION";
	}

	return initialData.layout === "NOMENCLATURE_DETAILS"
		? "NOMENCLATURE_DETAILS"
		: "NOMENCLATURE";
}

function buildBlankFields(
	existingFields: EditPrintTemplateFormValues["fields"],
): EditPrintTemplateFormValues["fields"] {
	return DEFAULT_FIELDS.map((field, index) => ({
		...field,
		id: existingFields[index]?.id ?? "",
		order: index + 1,
	}));
}

function buildCenterFields(
	existingFields: EditPrintTemplateFormValues["fields"],
): EditPrintTemplateFormValues["fields"] {
	return [
		{
			id: existingFields[0]?.id ?? "",
			fieldType: "name",
			isBold: false,
			fontSize: 14,
			order: 1,
		},
	];
}

function buildDetailFields(
	existingFields: EditPrintTemplateFormValues["fields"],
): EditPrintTemplateFormValues["fields"] {
	return fixedNomenclatureDetailsFields.map((field, index) => ({
		id:
			existingFields.find((existingField) => existingField.fieldType === field.field)
				?.id ?? "",
		fieldType: field.field,
		isBold: field.bold,
		fontSize: field.size,
		order: index + 1,
	}));
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
			fields: initialData.fields.map((field) => ({
				id: field.id,
				fieldType:
					field.fieldType === "NAME"
						? "name"
						: field.fieldType === "MODEL_ARTICLE"
							? "modelArticle"
							: field.fieldType === "COLOR"
								? "color"
								: field.fieldType === "SIZE"
									? "size"
									: field.fieldType === "COMPOSITION"
										? "composition"
										: "",
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
	const [templateKind, setTemplateKind] = useState<EditTemplateKind>(() =>
		getTemplateKind(initialData),
	);
	const qrPosition = watch("qrPosition");
	const fields = watch("fields");
	const canvasSize = watch("canvasSize");
	const isDetailsLayout = templateKind === "NOMENCLATURE_DETAILS";

	useEffect(() => {
		if (isDetailsLayout) {
			const nextFields = buildDetailFields(getValues("fields") ?? []);
			if (!hasSameFields(getValues("fields") ?? [], nextFields)) {
				setValue("fields", nextFields);
			}
			if (qrPosition !== "RIGHT") {
				setValue("qrPosition", "RIGHT");
			}
			return;
		}

		if (qrPosition === "CENTER") {
			const nextFields = buildCenterFields(getValues("fields") ?? []);
			if (!hasSameFields(getValues("fields") ?? [], nextFields)) {
				setValue("fields", nextFields);
			}
			return;
		}

		if (fields.length !== 4) {
			setValue("fields", buildBlankFields(getValues("fields") ?? []));
		}
	}, [fields.length, getValues, isDetailsLayout, qrPosition, setValue]);

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

	const applyTemplateKind = (nextTemplateKind: EditTemplateKind) => {
		const currentFields = getValues("fields") ?? [];
		setTemplateKind(nextTemplateKind);

		if (nextTemplateKind === "AGGREGATION") {
			setValue("type", "AGGREGATION", { shouldDirty: true, shouldValidate: true });
			setValue("layout", "STANDARD", { shouldDirty: true, shouldValidate: true });
			setValue("qrPosition", "RIGHT", { shouldDirty: true, shouldValidate: true });
			setValue("fields", buildBlankFields(currentFields), {
				shouldDirty: true,
				shouldValidate: true,
			});
			return;
		}

		if (nextTemplateKind === "NOMENCLATURE") {
			setValue("type", "NOMENCLATURE", {
				shouldDirty: true,
				shouldValidate: true,
			});
			setValue("layout", "STANDARD", {
				shouldDirty: true,
				shouldValidate: true,
			});
			setValue("qrPosition", "RIGHT", { shouldDirty: true, shouldValidate: true });
			setValue("fields", buildBlankFields(currentFields), {
				shouldDirty: true,
				shouldValidate: true,
			});
			return;
		}

		setValue("type", "NOMENCLATURE", {
			shouldDirty: true,
			shouldValidate: true,
		});
		setValue("layout", "NOMENCLATURE_DETAILS", {
			shouldDirty: true,
			shouldValidate: true,
		});
		setValue("qrPosition", "RIGHT", { shouldDirty: true, shouldValidate: true });
		setValue("fields", buildDetailFields(currentFields), {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const onSubmit = async (data: EditPrintTemplateFormValues) => {
		const payload =
			templateKind === "NOMENCLATURE_DETAILS"
				? {
						...data,
						type: "NOMENCLATURE" as const,
						layout: "NOMENCLATURE_DETAILS" as const,
						qrPosition: "RIGHT" as const,
						fields: buildDetailFields(data.fields),
					}
				: {
						...data,
						type: templateKind === "AGGREGATION" ? "AGGREGATION" : "NOMENCLATURE",
						layout: "STANDARD" as const,
					};

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
			<input type="hidden" {...register("type")} />
			<input type="hidden" {...register("layout")} />
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
					onChange={(e) => applyTemplateKind(e.target.value as EditTemplateKind)}
					className="border rounded p-2 w-full"
				>
					<option value="AGGREGATION">Агрегация</option>
					<option value="NOMENCLATURE">Номенклатура</option>
					<option value="NOMENCLATURE_DETAILS">Готовый шаблон</option>
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
					layout={isDetailsLayout ? "NOMENCLATURE_DETAILS" : "STANDARD"}
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
