import { create } from "zustand";

interface Configuration {
	label: string;
	value: {
		pieceInPack: number;
		packInPallet: number;
	};
}

interface Code {
	fileName: string;
	content: string;
}

interface Nomenclature {
	name: string;
	modelArticle: string;
	color: string;
	size: string;
	configurations: Configuration[];
	codes: Code[];
}

interface NomenclatureStore {
	nomenclature: Nomenclature;
	setNomenclature: (data: Partial<Nomenclature>) => void;
	reset: () => void;

	// Configurations
	addConfiguration: (config: Configuration) => void;
	removeConfiguration: (id: string) => void;
	updateConfiguration: (
		id: string,
		updatedConfig: Partial<Configuration>,
	) => void;

	// Codes
	addCode: (code: Code) => void;
	removeCode: (fileName: string) => void;
}

export const useNomenclatureStore = create<NomenclatureStore>((set) => ({
	nomenclature: {
		name: "",
		modelArticle: "",
		color: "",
		size: "",
		configurations: [],
		codes: [],
	},

	setNomenclature: (data) =>
		set((state) => ({
			nomenclature: { ...state.nomenclature, ...data },
		})),

	reset: () =>
		set({
			nomenclature: {
				name: "",
				modelArticle: "",
				color: "",
				size: "",
				configurations: [],
				codes: [],
			},
		}),

	// Configurations
	addConfiguration: (config) =>
		set((state) => ({
			nomenclature: {
				...state.nomenclature,
				configurations: [...state.nomenclature.configurations, config],
			},
		})),

	removeConfiguration: (id) =>
		set((state) => ({
			nomenclature: {
				...state.nomenclature,
				configurations: state.nomenclature.configurations.filter(
					(c) => c.id !== id,
				),
			},
		})),

	updateConfiguration: (id, updatedConfig) =>
		set((state) => ({
			nomenclature: {
				...state.nomenclature,
				configurations: state.nomenclature.configurations.map((c) =>
					c.id === id ? { ...c, ...updatedConfig } : c,
				),
			},
		})),

	// Codes
	addCode: (code) =>
		set((state) => ({
			nomenclature: {
				...state.nomenclature,
				codes: [...state.nomenclature.codes, code],
			},
		})),

	removeCode: (fileName) =>
		set((state) => ({
			nomenclature: {
				...state.nomenclature,
				codes: state.nomenclature.codes.filter((c) => c.fileName !== fileName),
			},
		})),
}));
