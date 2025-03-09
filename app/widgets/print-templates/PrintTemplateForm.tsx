"use client";

import { printTemplateSchema } from "@/entities/print-template/model/schema";
import type { PrintTemplateFormValues } from "@/entities/print-template/model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PrintingPreview from "./PrintingPreview";

enum TemplateFieldType {
	NAME = "name",
	MODEL_ARTICLE = "modelArticle",
	COLOR = "color",
	SIZE = "size",
}

const fieldOptions = [
	{ value: TemplateFieldType.NAME, label: "Имя" },
	{ value: TemplateFieldType.MODEL_ARTICLE, label: "Модель" },
	{ value: TemplateFieldType.COLOR, label: "Цвет" },
	{ value: TemplateFieldType.SIZE, label: "Размер" },
];

const PrintTemplateForm = () => {
	const [availableFields, setAvailableFields] = useState(fieldOptions);
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
			qrPosition: "right",
			type: "aggregation",
			textFields: Array(4).fill({ field: "", bold: false, size: 12 }),
			canvasSize: { width: "58mm", height: "40mm" },
		},
	});

	const qrPosition = watch("qrPosition");
	const textFields = watch("textFields");
	const canvasSize = watch("canvasSize");

	// Handle switching between QR positions.
	useEffect(() => {
		if (qrPosition === "center") {
			// In center mode, only show one field with "Имя" selected.
			setValue("textFields", [
				{ field: TemplateFieldType.NAME, bold: false, size: 14 },
			]);
		} else {
			// When switching back to left/right, reset to 4 selectors if not already.
			if (textFields.length !== 4) {
				setValue(
					"textFields",
					Array(4).fill({ field: "", bold: false, size: 14 }),
				);
			}
		}
	}, [qrPosition, setValue, textFields.length]);

	// Log errors
	useEffect(() => {
		console.log(errors);
	}, [errors]);

	// Update available fields only in left/right modes.
	useEffect(() => {
		if (qrPosition !== "center") {
			const selectedFields = getValues("textFields").map((t) => t.field);
			setAvailableFields(
				fieldOptions.filter((opt) => !selectedFields.includes(opt.value)),
			);
		}
	}, [textFields, getValues, qrPosition]);

	const onSubmit = async (data: PrintTemplateFormValues) => {
		console.log(data);
		try {
			const res = await fetch("/api/printing-templates", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
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
			<h1 className="text-xl font-bold">Новый шаблон печати</h1>

			<div className="p-4 border rounded-lg bg-white border-blue-600 space-y-4">
				<label htmlFor="name" className="font-bold">
					Название шаблона
				</label>
				<input {...register("name")} className="border rounded p-2 w-full" />
				{errors.name && <p className="text-red-500">{errors.name.message}</p>}

				<label className="font-bold">Тип этикетки:</label>
				<select {...register("type")} className="border rounded p-2 w-full">
					<option value="aggregation">Агрегация</option>
					<option value="nomenclature">Номенклатура</option>
				</select>

				<label className="font-bold">Тип QR-кода:</label>
				<select {...register("qrType")} className="border rounded p-2 w-full">
					<option value="qr">QR</option>
					<option value="datamatrix">Data Matrix</option>
				</select>
				<label className="font-bold">Позиция QR-кода:</label>
				<select
					{...register("qrPosition")}
					className="border rounded p-2 w-full"
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
				<label className="font-bold">Выберите текстовые поля:</label>
				{textFields.map((_, index) => (
					<div key={index} className="flex items-center space-x-4 mt-2">
						<Controller
							name={`textFields.${index}.field`}
							control={control}
							render={({ field }) => (
								<select {...field} className="border rounded p-2 w-full">
									<option value="">Не выбрано</option>
									{qrPosition === "center" ? (
										// In center mode, allow only "Имя"
										<option value={TemplateFieldType.NAME}>Имя</option>
									) : (
										availableFields.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))
									)}
								</select>
							)}
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
									className="border rounded p-1 w-16 text-center"
								/>
							)}
						/>
					</div>
				))}
			</div>
			<div className="w-full">
				<PrintingPreview
					textFields={textFields}
					qrPosition={qrPosition}
					canvasSize={canvasSize}
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
