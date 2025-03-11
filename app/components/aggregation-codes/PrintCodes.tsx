"use client";

import type {
	NomenclatureOption,
	PrintTemplate,
} from "@/aggregation/model/types";
import { usePrintStore } from "@/shared/store/printStore";
import { useEffect } from "react";
import BarcodeComponent from "../BarcodeComponent";

interface Props {
	printTemplate: PrintTemplate;
	selectedNomenclature: NomenclatureOption | null;
}

const PrintCodes: React.FC<Props> = ({
	printTemplate,
	selectedNomenclature,
}: Props) => {
	const { printCodes: codes, shouldPrint, resetPrint } = usePrintStore();

	// Trigger printing when the print flag is set
	useEffect(() => {
		if (shouldPrint) {
			window.print();
			resetPrint();
		}
	}, [shouldPrint, resetPrint]);

	const getFieldValue = (
		nomenclature: NomenclatureOption,
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
				return nomenclature?.size || "";
			default:
				return "";
		}
	};

	const fieldLabels = {
		NAME: "Наименование",
		MODEL_ARTICLE: "Модель/Артикул",
		COLOR: "Цвет",
		SIZE: "Размер",
	};

	return (
		<div className="print-container printable hidden print:block text:black">
			{codes &&
				codes.map((code, index) => {
					// Sort template fields based on the 'order' property
					const sortedFields = [...printTemplate.fields].sort(
						(a, b) => a.order - b.order,
					);

					// Build the QR/Generated Code column (50% width)
					const qrColumn = (
						<div
							style={{
								width: "50%",
								display: "flex",
								flexDirection: "column",
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
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								padding: "0",
								fontSize: "10px",
							}}
						>
							{sortedFields.map((field) => (
								<div
									key={field.order}
									className="w-full h-full flex items-center text-start centered"
									style={{ marginBottom: "1mm" }}
								>
									<strong>
										{fieldLabels[field.fieldType] || field.fieldType}:
									</strong>
									<span
										style={{
											fontSize: `${field.fontSize}`,
											fontWeight: field.isBold ? "bold" : "normal",
										}}
									>
										{getFieldValue(selectedNomenclature, field.fieldType)}
									</span>
								</div>
							))}
						</div>
					);

					// Layout: QR column on left or right based on qrPosition setting
					return (
						<div
							key={index}
							className="print-page"
							style={{
								width: "58mm",
								height: "40mm",
								display: "flex",
								flexDirection: "row",
								boxSizing: "border-box",
								padding: "2mm",
							}}
						>
							{printTemplate.qrPosition === "LEFT" ? (
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
				})}
		</div>
	);
};

export default PrintCodes;
