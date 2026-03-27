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
		<div className="flex h-full w-full items-center justify-center rounded-sm border bg-gray-50">
			<span className={compact ? "text-xs" : "text-sm"}>QR</span>
		</div>
	);

	const renderTextFields = () => (
		<div className="flex h-full w-full flex-col gap-2 p-2">
			{textFields.map((field, index) => {
				if (!field.field) return null;

				return (
					<div
						key={`${field.field}-${index}`}
						style={{
							fontSize: `${field.size}px`,
							fontWeight: field.bold ? "bold" : "normal",
						}}
						className="flex h-full w-full items-center"
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
			lineHeight: 1.05,
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
				<span className="text-[8px]">{label}:</span>
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
				className="mx-auto flex flex-col gap-1 border bg-white p-1"
			>
				<div className="flex h-[60%] gap-2">
					<div className="flex w-[62%] flex-col justify-between overflow-hidden">
						{renderDetailRow("Дата", "05.03.2026")}
						{renderDetailRow("Наименование", "Блузка женская", {
							field: "name",
							hideLabel: true,
						})}
						{renderDetailRow("Бренд", nomenclatureLayoutStaticContent.brand)}
						{renderDetailRow("Модель", "Артикул 7777", {
							field: "modelArticle",
						})}
						{renderDetailRow("Размер", "46", {
							field: "size",
						})}
						{renderDetailRow("Цвет", "Пудра", {
							field: "color",
						})}
					</div>
					<div className="flex w-[38%] items-center justify-center">
						<div className="h-[75%] w-full">{renderQRCode(true)}</div>
					</div>
				</div>
				<div className="flex h-[40%] flex-col justify-between overflow-hidden pt-1">
					{renderDetailRow(
						"Изготовитель",
						nomenclatureLayoutStaticContent.manufacturer,
					)}
					{renderDetailRow("Адрес", nomenclatureLayoutStaticContent.address)}
					<div className="text-[9px] leading-tight">
						{nomenclatureLayoutStaticContent.countryOfOrigin}
					</div>
					{renderDetailRow("Состав", "Вискоза 60%,ПЭ 35%,Эл 5%", {
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
				className="mx-auto flex flex-col items-center gap-2 border bg-white p-1"
			>
				<div className="h-full w-1/2">{renderQRCode()}</div>
				<div>{renderTextFields()}</div>
			</div>
		);
	}

	if (normalizedQrPosition === "left") {
		return (
			<div style={containerStyle} className="mx-auto flex border bg-white p-1">
				<div className="w-1/2">{renderQRCode()}</div>
				<div className="w-1/2">{renderTextFields()}</div>
			</div>
		);
	}

	return (
		<div style={containerStyle} className="mx-auto flex border bg-white p-1">
			<div className="w-1/2">{renderTextFields()}</div>
			<div className="w-1/2">{renderQRCode()}</div>
		</div>
	);
};

export default PrintingPreview;
