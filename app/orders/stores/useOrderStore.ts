import { create } from "zustand";

interface ICodes {
	generatedCode: string;
	nomenclature: string;
	codes: string[];
}

interface IOrderStore {
	codes: ICodes[];
	selectedCode: string | null;
	setCodes: (codes: ICodes[]) => void;
	setSelectedCode: (code: string) => void;
	addCodes: (code: ICodes) => void;
	getCodesByGeneratedCode: (generatedCode: string) => ICodes | undefined;
	getGeneratedCodes: () => string[];
	getCodesRawData: () => string[];
	reset: () => void;
}

export const useOrderStore = create<IOrderStore>((set, get) => ({
	codes: [],
	selectedCode: null,
	setCodes: (codes: ICodes[]) => {
		set({ codes });
	},
	setSelectedCode: (code: string) => {
		set({ selectedCode: code });
	},
	addCodes: (code: ICodes) => {
		const { codes } = get();
		set({ codes: [...codes, code] });
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
	reset: () => {
		set({ codes: [], selectedCode: null });
	},
}));
