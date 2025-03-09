export interface PrintTemplate {
	id: string;
	name: string;
	type: "NOMENCLATURE" | "AGGREGATION";
	createdAt: string;
	isDefault: boolean;
}
