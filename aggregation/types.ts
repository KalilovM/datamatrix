export interface NomenclatureOption {
  id: string;
  name: string;
}

export interface Configuration {
  pieceInPack: number;
  packInPallet: number;
  id: string;
  nomenclatureId: string;
}

export interface PageData {
  packValues: string[];
  uniqueCode: string | null;
}
