import { create } from "zustand";

export interface IGtinSize {
	id: string;
	GTIN: string;
	size: string;
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
	updateGtinSize: (oldGtin, oldSize, newGtinSize) =>
		set((state) => ({
			gtinSize: state.gtinSize.map((entry) =>
				entry.GTIN === oldGtin && Number.parseInt(entry.size) === oldSize
					? newGtinSize
					: entry,
			),
		})),
	removeGtinSize: (gtin) =>
		set((state) => ({
			gtinSize: state.gtinSize.filter((size) => size.GTIN !== gtin),
		})),
	reset: () => set({ gtinSize: [] }),
}));
