export interface PrintTemplate {
	id: string;
	name: string;
	type: "NOMENCLATURE" | "AGGREGATION";
	layout: "STANDARD" | "NOMENCLATURE_DETAILS";
	createdAt: string;
	isDefault: boolean;
}
