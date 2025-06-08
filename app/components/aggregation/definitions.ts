export interface NomenclatureOption {
  name: string | null;
  id: string;
  configurations: Configuration[];
}

export interface Configuration {
  id: string;
  nomenclatureId: string;
  pieceInPack: number;
  packInPallet: number;
}
