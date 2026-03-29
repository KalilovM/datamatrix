interface PrintTemplateField {
	id: string;
	fieldType: string;
	isBold: boolean;
	fontSize: number | string;
	order: number;
}

export interface PrintTemplateData {
	id: string;
	name: string;
	type: "AGGREGATION" | "NOMENCLATURE";
	layout: "STANDARD" | "NOMENCLATURE_DETAILS";
	qrType: "QR" | "DATAMATRIX";
	qrPosition: "LEFT" | "RIGHT" | "CENTER";
	width: number | string;
	height: number | string;
	isDefault: boolean;
	fields: PrintTemplateField[];
}
