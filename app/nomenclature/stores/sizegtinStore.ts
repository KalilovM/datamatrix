import { create } from "zustand";

export interface IGtinSize {
	GTIN: string;
	size: number;
}

interface GtinSizeState {
	gtinSize: IGtinSize[];
	addGtinSize: (gtinSize: IGtinSize) => void;
	updateGtinSize: (gtin: string, updatedGtinSize: IGtinSize) => void;
	removeGtinSize: (gtin: string) => void;
	reset: () => void;
}

export const useGtinSizeStore = create<GtinSizeState>((set) => ({
	gtinSize: [],
	addGtinSize: (gtinSize) =>
		set((state) => ({
			gtinSize: [...state.gtinSize, gtinSize],
		})),
	updateGtinSize: (gtin, updatedGtinSize) =>
		set((state) => ({
			gtinSize: state.gtinSize.map((size) =>
				size.GTIN === gtin ? updatedGtinSize : size,
			),
		})),
	removeGtinSize: (gtin) =>
		set((state) => ({
			gtinSize: state.gtinSize.filter((size) => size.GTIN !== gtin),
		})),
	reset: () => set({ gtinSize: [] }),
}));
