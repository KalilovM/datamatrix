import { create } from "zustand";

interface ICodes {
  generatedCode: string;
  nomenclature: string;
  codes: string[];
}

type CodeValue = string | { value?: string; formattedValue?: string; id?: string };
type NomenclatureValue =
  | string
  | { modelArticle?: string | null; name?: string | null; id?: string };

const toCodeValue = (code: CodeValue): string => {
  if (typeof code === "string") return code;

  return code.value ?? code.formattedValue ?? code.id ?? "";
};

const toNomenclatureValue = (nomenclature: NomenclatureValue): string => {
  if (typeof nomenclature === "string") return nomenclature;

  return nomenclature.modelArticle ?? nomenclature.name ?? nomenclature.id ?? "";
};

const normalizeCodeEntry = (code: ICodes): ICodes => ({
  ...code,
  nomenclature: toNomenclatureValue(
    code.nomenclature as NomenclatureValue,
  ),
  codes: (code.codes as CodeValue[]).map(toCodeValue).filter(Boolean),
});

interface IOrderStore {
  codes: ICodes[];
  selectedCode: string | null;
  setCodes: (codes: ICodes[]) => void;
  setSelectedCode: (code: string | null) => void;
  addCodes: (code: ICodes) => void;
  removeCode: (generatedCode: string) => void;
  getCodesByGeneratedCode: (generatedCode: string) => ICodes | undefined;
  getGeneratedCodes: () => string[];
  getCodesRawData: () => string[];
  isCodeExists: (generatedCode: string) => boolean;
  reset: () => void;
}

export const useOrderStore = create<IOrderStore>((set, get) => ({
  codes: [],
  selectedCode: null,
  setCodes: (codes: ICodes[]) => {
    set({ codes: codes.map(normalizeCodeEntry) });
  },
  setSelectedCode: (code: string | null) => {
    set({ selectedCode: code });
  },
  addCodes: (code: ICodes) => {
    const { codes } = get();
    set({ codes: [...codes, normalizeCodeEntry(code)] });
  },
  removeCode: (generatedCode: string) => {
    const { codes } = get();
    set({
      codes: codes.filter((code) => code.generatedCode !== generatedCode),
    });
  },
  getCodesByGeneratedCode: (generatedCode: string) => {
    const { codes } = get();
    return codes.find((code) => code.generatedCode === generatedCode);
  },
  getGeneratedCodes: () => {
    const { codes } = get();
    return codes.map((code) => code.generatedCode);
  },
  getCodesRawData: () => {
    const { codes } = get();
    return codes.flatMap((code) => code.codes);
  },
  isCodeExists: (generatedCode: string) => {
    const { codes } = get();
    return codes.some((code) => code.generatedCode === generatedCode);
  },

  reset: () => {
    set({ codes: [], selectedCode: null });
  },
}));
