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
					// Sort fields based on the 'order' property from the template
					const sortedFields = [...printTemplate.fields].sort(
						(a, b) => a.order - b.order,
					);

					// Use template values for the container dimensions
					const containerStyle = {
						width: `${printTemplate.width}mm`,
						height: `${printTemplate.height}mm`,
						display: "flex",
						flexDirection: "row" as const,
						boxSizing: "border-box" as const,
						padding: "2mm",
					};

					// QR Column styling
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

					// Fields column: each field uses the fontSize and isBold properties from the template
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
									className="w-full h-full flex items-center text-start centered"
									style={{ marginBottom: "1mm" }}
								>
									<strong
										style={{
											fontSize: "10px",
										}}
									>
										{fieldLabels[field.fieldType] || field.fieldType}:
									</strong>
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

					// Layout based on qrPosition setting
					return (
						<div key={index} className="print-page" style={containerStyle}>
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
