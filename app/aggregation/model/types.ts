export interface AggregationConfig {
	pieceInPack: number;
	packInPallet: number;
	id: string;
	nomenclatureId: string;
}

export interface NomenclatureOption {
	id: string;
	name: string;
	configurations: AggregationConfig[];
}
