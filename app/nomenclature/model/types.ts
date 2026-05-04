export interface Nomenclature {
	id: string;
	name: string;
	modelArticle: string;
	color: string;
	composition?: string;
	compositionId?: string;
	GTIN: string[];
	size?: number[];
	codeCount: number;
}

export const NOMENCLATURE_PAGE_SIZE = 10;

export interface NomenclaturesResponse {
	items: Nomenclature[];
	totalCount: number;
	totalPages: number;
	page: number;
	pageSize: number;
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
}
