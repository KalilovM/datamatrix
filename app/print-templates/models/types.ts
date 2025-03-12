interface PrintTemplateField {
	id: string;
	fieldType: string;
	isBold: boolean;
	fontSize: string;
	order: number;
}

export interface PrintTemplateData {
	id: string;
	name: string;
	type: "AGGREGATION" | "NOMENCLATURE";
	qrType: "QR" | "DATAMATRIX";
	qrPosition: "LEFT" | "RIGHT" | "CENTER";
	width: string;
	height: string;
	isDefault: boolean;
	fields: PrintTemplateField[];
}
