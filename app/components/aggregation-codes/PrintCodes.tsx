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
import { useCallback, useEffect, useRef } from "react";
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
	const printContainerRef = useRef<HTMLDivElement>(null);

	const printInIframe = useCallback(async () => {
		if (!printTemplate || !printContainerRef.current) {
			resetPrint();
			return;
		}

		const iframe = document.createElement("iframe");
		iframe.style.position = "fixed";
		iframe.style.right = "0";
		iframe.style.bottom = "0";
		iframe.style.width = "0";
		iframe.style.height = "0";
		iframe.style.border = "0";
		iframe.setAttribute("aria-hidden", "true");
		document.body.appendChild(iframe);

		const iframeWindow = iframe.contentWindow;
		const iframeDocument = iframeWindow?.document;
		if (!iframeWindow || !iframeDocument) {
			iframe.remove();
			resetPrint();
			return;
		}

		iframeDocument.open();
		iframeDocument.write(`
			<!doctype html>
			<html>
				<head>
					<meta charset="utf-8" />
					<title>Print labels</title>
					<style>
						@page {
							size: ${printTemplate.width}mm ${printTemplate.height}mm;
							margin: 0;
						}

						html,
						body {
							margin: 0;
							padding: 0;
							width: ${printTemplate.width}mm;
							height: auto;
							overflow: visible;
							background: white;
							-webkit-print-color-adjust: exact;
							print-color-adjust: exact;
						}

						.print-root {
							display: block;
							width: ${printTemplate.width}mm;
							margin: 0;
							padding: 0;
							background: white;
						}

						.print-page {
							width: ${printTemplate.width}mm !important;
							height: ${printTemplate.height}mm !important;
							margin: 0;
							overflow: hidden;
							page-break-after: always;
							page-break-inside: avoid;
							break-after: page;
							break-inside: avoid;
							box-sizing: border-box;
						}

						.print-page:last-child {
							page-break-after: auto;
							break-after: auto;
						}

						img,
						canvas {
							display: block;
							max-width: 100%;
						}

						p {
							margin: 0;
						}
					</style>
				</head>
				<body></body>
			</html>
		`);
		iframeDocument.close();

		const printRoot = printContainerRef.current;
		const clonedRoot = printRoot.cloneNode(true) as HTMLDivElement;
		clonedRoot.className = "print-root";

		const sourceCanvases = Array.from(printRoot.querySelectorAll("canvas"));
		const clonedCanvases = Array.from(clonedRoot.querySelectorAll("canvas"));
		sourceCanvases.forEach((canvas, index) => {
			const replacementImage = iframeDocument.createElement("img");
			replacementImage.src = canvas.toDataURL("image/png");
			replacementImage.width = canvas.width;
			replacementImage.height = canvas.height;
			replacementImage.style.width = `${canvas.width}px`;
			replacementImage.style.height = "auto";
			clonedCanvases[index]?.replaceWith(replacementImage);
		});

		iframeDocument.body.appendChild(clonedRoot);

		const iframeImages = Array.from(iframeDocument.images);
		await Promise.all(
			iframeImages.map(
				(image) =>
					new Promise<void>((resolve) => {
						if (image.complete) {
							resolve();
							return;
						}
						image.onload = () => resolve();
						image.onerror = () => resolve();
					}),
			),
		);

		let cleanedUp = false;
		const cleanup = () => {
			if (cleanedUp) {
				return;
			}
			cleanedUp = true;
			iframe.remove();
			resetPrint();
		};

		iframeWindow.addEventListener("afterprint", cleanup, { once: true });
		iframeWindow.focus();
		iframeWindow.print();
		window.setTimeout(cleanup, 1000);
	}, [printTemplate, resetPrint]);

	useEffect(() => {
		if (shouldPrint) {
			void printInIframe();
		}
	}, [printInIframe, shouldPrint]);

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
		<div
			ref={printContainerRef}
			className="print-container printable hidden print:block text:black"
		>
			{codes?.map((code, index) =>
				isNomenclatureDetailsLayout(printTemplate.layout)
					? renderDetailsLayout(code, index)
					: renderStandardLayout(code, index),
			)}
		</div>
	);
};

export default PrintCodes;
