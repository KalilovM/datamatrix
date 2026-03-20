"use client";

import type { PrintTemplate } from "@/aggregation/model/types";
import {
	isNomenclatureDetailsLayout,
	nomenclatureLayoutStaticContent,
	normalizeEditableFieldType,
	templateFieldLabels,
	type EditableTemplateField,
} from "@/shared/lib/printingTemplate";
import { usePrintStore } from "@/shared/store/printStore";
import { useEffect } from "react";
import BarcodeComponent from "../BarcodeComponent";

type PrintableNomenclature = {
	name?: string | null;
	modelArticle?: string | null;
	color?: string | null;
	composition?: string | null;
};

interface Props {
	printTemplate: PrintTemplate | null | undefined;
	selectedNomenclature: PrintableNomenclature | null;
}

const PrintCodes: React.FC<Props> = ({
	printTemplate,
	selectedNomenclature,
}: Props) => {
	const { printCodes: codes, size, shouldPrint, resetPrint } = usePrintStore();

	useEffect(() => {
		if (shouldPrint) {
			window.print();
			resetPrint();
		}
	}, [shouldPrint, resetPrint]);

	if (!printTemplate) {
		return null;
	}

	const getFieldValue = (
		nomenclature: PrintableNomenclature,
		fieldType: string,
	) => {
		switch (fieldType) {
			case "NAME":
				return nomenclature?.name || "";
			case "MODEL_ARTICLE":
				return nomenclature?.modelArticle || "";
			case "COLOR":
				return nomenclature?.color || "";
			case "SIZE":
				return size || "";
			case "COMPOSITION":
				return nomenclature?.composition || "";
			default:
				return "";
		}
	};

	const renderStandardLayout = (code: string, index: number) => {
		const sortedFields = [...printTemplate.fields].sort(
			(a, b) => a.order - b.order,
		);

		const containerStyle = {
			width: `${printTemplate.width}mm`,
			height: `${printTemplate.height}mm`,
			display: "flex",
			flexDirection: "row" as const,
			boxSizing: "border-box" as const,
			paddingLeft: "4mm",
			paddingTop: "2mm",
		};

		const qrColumn = (
			<div
				style={{
					width: "50%",
					display: "flex",
					flexDirection: "column" as const,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<BarcodeComponent
					text={code}
					size={80}
					type={printTemplate.qrType}
				/>
			</div>
		);

		const fieldsColumn = (
			<div
				style={{
					width: "50%",
					display: "flex",
					flexDirection: "column" as const,
					justifyContent: "center",
					alignItems: "center",
					padding: "0",
				}}
			>
				{sortedFields.map((field) => (
					<div
						key={field.order}
						className="w-full h-full flex flex-col items-start text-start centered"
						style={{ marginBottom: "1mm" }}
					>
						{field.fieldType !== "NAME" && (
							<p
								style={{
									fontSize: "8px",
								}}
							>
								{templateFieldLabels[
									normalizeEditableFieldType(field.fieldType) as EditableTemplateField
								] || field.fieldType}
								:
							</p>
						)}
						<p
							style={{
								fontSize: `${field.fontSize}px`,
								fontWeight: field.isBold ? "bold" : "normal",
								marginLeft: "0.5mm",
							}}
						>
							{selectedNomenclature
								? getFieldValue(selectedNomenclature, field.fieldType)
								: ""}
						</p>
					</div>
				))}
			</div>
		);

		return (
			<div key={index} className="print-page" style={containerStyle}>
				{printTemplate.qrPosition === "CENTER" ? (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
						}}
					>
						<BarcodeComponent
							text={code}
							size={100}
							type={printTemplate.qrType}
						/>
						<span
							style={{
								fontSize: `${sortedFields[0].fontSize}px`,
								fontWeight: sortedFields[0].isBold ? "bold" : "normal",
							}}
						>
							{selectedNomenclature
								? getFieldValue(
										selectedNomenclature,
										sortedFields[0].fieldType,
									)
								: ""}
						</span>
					</div>
				) : printTemplate.qrPosition === "LEFT" ? (
					<>
						{qrColumn}
						{fieldsColumn}
					</>
				) : (
					<>
						{fieldsColumn}
						{qrColumn}
					</>
				)}
			</div>
		);
	};

	const renderDetailsLayout = (code: string, index: number) => {
		const printDate = new Intl.DateTimeFormat("ru-RU").format(new Date());
		const sortedFields = [...printTemplate.fields].sort(
			(a, b) => a.order - b.order,
		);
		const fieldStyleMap = new Map(sortedFields.map((field) => [field.fieldType, field]));
		const compositionField = fieldStyleMap.get("COMPOSITION");

		const renderDetailRow = (
			label: string,
			value: string,
			options?: {
				fieldType?: "NAME" | "MODEL_ARTICLE" | "SIZE" | "COLOR" | "COMPOSITION";
				defaultSize?: number;
				isAccent?: boolean;
			},
		) => {
			const fieldStyle = options?.fieldType
				? fieldStyleMap.get(options.fieldType)
				: undefined;

			return (
				<div style={{ display: "flex", gap: "1mm", alignItems: "baseline" }}>
					<span style={{ fontSize: "8px", fontWeight: "bold" }}>{label}:</span>
					<span
						style={{
							fontSize: `${fieldStyle?.fontSize ?? options?.defaultSize ?? 9}px`,
							fontWeight:
								fieldStyle?.isBold || options?.isAccent ? "bold" : "normal",
						}}
					>
						{value}
					</span>
				</div>
			);
		};

		return (
			<div
				key={index}
				className="print-page"
				style={{
					width: `${printTemplate.width}mm`,
					height: `${printTemplate.height}mm`,
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
					padding: "2mm",
					gap: "1mm",
				}}
			>
				<div
					style={{
						height: "60%",
						display: "flex",
						gap: "2mm",
					}}
				>
					<div
						style={{
							width: "62%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							overflow: "hidden",
						}}
					>
						{renderDetailRow("Дата", printDate)}
						{renderDetailRow(
							"Наименование",
							selectedNomenclature?.name || "",
							{ fieldType: "NAME", defaultSize: 11, isAccent: true },
						)}
						{renderDetailRow("Бренд", nomenclatureLayoutStaticContent.brand)}
						{renderDetailRow(
							"Модель",
							selectedNomenclature?.modelArticle || "",
							{ fieldType: "MODEL_ARTICLE" },
						)}
						{renderDetailRow("Размер", size || "", { fieldType: "SIZE" })}
						{renderDetailRow("Цвет", selectedNomenclature?.color || "", {
							fieldType: "COLOR",
						})}
					</div>
					<div
						style={{
							width: "38%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<div
							style={{
								width: "100%",
								height: "75%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<BarcodeComponent
								text={code}
								size={72}
								type={printTemplate.qrType}
								showText={false}
							/>
						</div>
					</div>
				</div>
				<div
					style={{
						height: "40%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						borderTop: "0.2mm solid #111",
						paddingTop: "1mm",
					}}
				>
					{renderDetailRow(
						"Изготовитель",
						nomenclatureLayoutStaticContent.manufacturer,
					)}
					{renderDetailRow("Адрес", nomenclatureLayoutStaticContent.address)}
					<div style={{ fontSize: "9px", fontWeight: "bold" }}>
						{nomenclatureLayoutStaticContent.countryOfOrigin}
					</div>
					<div style={{ display: "flex", gap: "1mm", alignItems: "baseline" }}>
						<span style={{ fontSize: "8px", fontWeight: "bold" }}>Состав:</span>
						<span
							style={{
								fontSize: `${compositionField?.fontSize ?? 9}px`,
								fontWeight: compositionField?.isBold ? "bold" : "normal",
							}}
						>
							{selectedNomenclature?.composition || ""}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="print-container printable hidden print:block text:black">
			{codes?.map((code, index) =>
				isNomenclatureDetailsLayout(printTemplate.layout)
					? renderDetailsLayout(code, index)
					: renderStandardLayout(code, index),
			)}
		</div>
	);
};

export default PrintCodes;
