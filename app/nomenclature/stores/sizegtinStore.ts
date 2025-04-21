import { create } from "zustand";

export interface IGtinSize {
	id: string | null;
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
	setGtinSize: (gtinSize: IGtinSize[]) => void;
	removeGtinSize: (gtin: string) => void;
	reset: () => void;
}

export const useGtinSizeStore = create<GtinSizeState>((set) => ({
	gtinSize: [],
	addGtinSize: (gtinSize) =>
		set((state) => ({
			gtinSize: [...state.gtinSize, gtinSize],
		})),
	setGtinSize: (gtinSize) =>
		set((state) => ({
			gtinSize,
		})),
	updateGtinSize: (oldGtin, oldSize, updatedGtinSize) =>
		set((state) => ({
			gtinSize: state.gtinSize.map((entry) => {
				if (entry.GTIN === oldGtin && entry.size === oldSize) {
					return {
						...entry,
						...updatedGtinSize,
						id: updatedGtinSize.id ?? entry.id,
					};
				}
				return entry;
			}),
		})),
	removeGtinSize: (gtin) =>
		set((state) => ({
			gtinSize: state.gtinSize.filter((size) => size.GTIN !== gtin),
		})),
	reset: () => set({ gtinSize: [] }),
}));
