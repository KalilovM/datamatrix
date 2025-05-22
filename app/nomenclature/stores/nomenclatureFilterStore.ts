import { create } from "zustand";

interface Filters {
	name: string;
	modelArticle: string;
	color: string;
	gtin: string;
}

interface FilterStore {
	filters: Filters;
	setFilters: (filters: Filters) => void;
	updateFilter: (key: keyof Filters, value: string) => void;
	resetFilters: () => void;
}

const defaultFilters: Filters = {
	name: "",
	modelArticle: "",
	color: "",
	gtin: "",
};

export const useNomenclatureFilterStore = create<FilterStore>((set) => ({
	filters: defaultFilters,
	setFilters: (filters) => set({ filters }),
	updateFilter: (key, value) =>
		set((state) => ({
			filters: { ...state.filters, [key]: value },
		})),
	resetFilters: () => set({ filters: defaultFilters }),
}));
