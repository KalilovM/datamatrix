export interface Nomenclature {
	id: string;
	name: string;
	codeCount: number;
}

export interface ProcessedCodeFile {
	name: string;
	content: string;
	codes: {
		create: {
			value: string;
			formattedValue: string;
		}[];
	};
	size: number;
}
