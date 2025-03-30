export interface AggregationConfig {
	pieceInPack: number;
	packInPallet: number;
	id: string;
	nomenclatureId: string;
}

export interface NomenclatureOption {
	id: string;
	name: string;
	color: string;
	modelArticle: string;
	size: string;
	codes: string[];
}

export interface PackPage {
	packValues: string[];
	uniqueCode: string | null;
	size: string | null;
}

export interface PrintTemplate {
	width: number;
	height: number;
	qrPosition: "LEFT" | "RIGHT" | "CENTER";
	qrType: "QR" | "DATAMATRIX";
	fields: {
		order: number;
		fieldType: "NAME" | "MODEL_ARTICLE" | "COLOR" | "SIZE";
		isBold: boolean;
		fontSize: number;
	};
}

export interface GeneratedCodePack {
	name: string;
	modelArticle: string;
	size: string;
	color: string;
	generatedCode: string;
	configuration: string;
	codes: string[];
}
