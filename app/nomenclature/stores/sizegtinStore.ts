import { create } from "zustand";

export interface IGtinSize {
	GTIN: string;
	size: number;
}

interface GtinSizeState {
	gtinSize: IGtinSize[];
	addGtinSize: (gtinSize: IGtinSize) => void;
	updateGtinSize: (
		oldGtin: string,
		oldSize: number,
		newGtinSize: IGtinSize,
	) => void;
	removeGtinSize: (gtin: string) => void;
	reset: () => void;
}

export const useGtinSizeStore = create<GtinSizeState>((set) => ({
	gtinSize: [],
	addGtinSize: (gtinSize) =>
		set((state) => ({
			gtinSize: [...state.gtinSize, gtinSize],
		})),
	updateGtinSize: (oldGtin, oldSize, updatedGtinSize) =>
		set((state) => ({
			gtinSize: state.gtinSize.map((entry) =>
				entry.GTIN === oldGtin && entry.size === oldSize
					? updatedGtinSize
					: entry,
			),
		})),
	removeGtinSize: (gtin) =>
		set((state) => ({
			gtinSize: state.gtinSize.filter((size) => size.GTIN !== gtin),
		})),
	reset: () => set({ gtinSize: [] }),
}));
