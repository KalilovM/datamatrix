"use client";

import {
	isNomenclatureDetailsLayout,
	nomenclatureLayoutStaticContent,
	templateFieldLabels,
	type EditableTemplateField,
} from "@/shared/lib/printingTemplate";
import type React from "react";

interface TextField {
	field: EditableTemplateField | "";
	bold: boolean;
	size: number;
}

interface CanvasSize {
	width: string;
	height: string;
}

interface PrintingPreviewProps {
	textFields: TextField[];
	qrPosition: "left" | "right" | "center" | string;
	canvasSize: CanvasSize;
	layout?: string;
}

const PrintingPreview: React.FC<PrintingPreviewProps> = ({
	textFields,
	qrPosition,
	canvasSize,
	layout,
}) => {
	const containerStyle = {
		width: canvasSize.width,
		height: canvasSize.height,
	};

	const normalizedQrPosition = String(qrPosition).toLowerCase();
	const textFieldMap = new Map(
		textFields
			.filter((field): field is TextField & { field: EditableTemplateField } =>
				Boolean(field.field),
			)
			.map((field) => [field.field, field]),
	);

	const renderQRCode = (compact = false) => (
		<div className="flex items-center justify-center border w-full h-full rounded-sm bg-gray-50">
			<span className={compact ? "text-xs" : "text-sm"}>QR</span>
		</div>
	);

	const renderTextFields = () => (
		<div className="flex flex-col gap-2 p-2 w-full h-full">
			{textFields.map((field, index) => {
				if (!field.field) return null;

				return (
					<div
						key={`${field.field}-${index}`}
						style={{
							fontSize: `${field.size}px`,
							fontWeight: field.bold ? "bold" : "normal",
						}}
						className="w-full h-full flex items-center"
					>
						{templateFieldLabels[field.field]}
					</div>
				);
			})}
		</div>
	);

	const renderDetailRow = (
		label: string,
		value: string,
		options?: {
			field?: EditableTemplateField;
			defaultSize?: number;
			hideLabel?: boolean;
		},
	) => {
		const fieldStyle = options?.field ? textFieldMap.get(options.field) : undefined;
		const valueStyle = {
			fontSize: `${fieldStyle?.size ?? options?.defaultSize ?? 9}px`,
			fontWeight: fieldStyle?.bold ? "bold" : "normal",
		} as const;

		if (options?.hideLabel) {
			return (
				<div className="leading-tight">
					<span style={valueStyle} className="truncate">
						{value}
					</span>
				</div>
			);
		}

		return (
			<div className="flex items-baseline gap-1 leading-tight">
				<span className="text-[8px]">
					{label}:
				</span>
				<span style={valueStyle} className="truncate">
					{value}
				</span>
			</div>
		);
	};

	if (isNomenclatureDetailsLayout(layout)) {
		return (
			<div
				style={containerStyle}
				className="border p-1 bg-white mx-auto flex flex-col gap-1"
			>
				<div className="flex gap-2 h-[60%]">
					<div className="w-[62%] flex flex-col justify-between overflow-hidden">
						{renderDetailRow("Дата", "20.03.2026")}
						{renderDetailRow("Наименование", "Номенклатура", {
							field: "name",
							hideLabel: true,
						})}
						{renderDetailRow("Бренд", nomenclatureLayoutStaticContent.brand)}
						{renderDetailRow("Модель", "Модель", {
							field: "modelArticle",
						})}
						{renderDetailRow("Размер", "42", {
							field: "size",
						})}
						{renderDetailRow("Цвет", "Черный", {
							field: "color",
						})}
					</div>
					<div className="w-[38%] flex items-center justify-center">
						<div className="w-full h-[75%]">{renderQRCode(true)}</div>
					</div>
				</div>
				<div className="h-[40%] flex flex-col justify-between overflow-hidden border-t pt-1">
					{renderDetailRow(
						"Изготовитель",
						nomenclatureLayoutStaticContent.manufacturer,
					)}
					{renderDetailRow("Адрес", nomenclatureLayoutStaticContent.address)}
					<div className="text-[9px] leading-tight">
						{nomenclatureLayoutStaticContent.countryOfOrigin}
					</div>
					{renderDetailRow("Состав", "100% хлопок", {
						field: "composition",
					})}
				</div>
			</div>
		);
	}

	if (normalizedQrPosition === "center") {
		return (
			<div
				style={containerStyle}
				className="border p-1 flex flex-col items-center bg-white mx-auto gap-2"
			>
				<div className="w-1/2 h-full">{renderQRCode()}</div>
				<div>{renderTextFields()}</div>
			</div>
		);
	}

	if (normalizedQrPosition === "left") {
		return (
			<div style={containerStyle} className="border p-1 flex bg-white mx-auto">
				<div className="w-1/2">{renderQRCode()}</div>
				<div className="w-1/2">{renderTextFields()}</div>
			</div>
		);
	}

	return (
		<div style={containerStyle} className="border p-1 flex bg-white mx-auto">
			<div className="w-1/2">{renderTextFields()}</div>
			<div className="w-1/2">{renderQRCode()}</div>
		</div>
	);
};

export default PrintingPreview;
