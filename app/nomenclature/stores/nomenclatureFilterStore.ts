import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const useNomenclatureFilterStore = create<FilterStore>()(
	persist(
		(set) => ({
			filters: defaultFilters,
			setFilters: (filters) => set({ filters }),
			updateFilter: (key, value) =>
				set((state) => ({
					filters: { ...state.filters, [key]: value },
				})),
			resetFilters: () => set({ filters: defaultFilters }),
		}),
		{
			name: "nomenclature-filters",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ filters: state.filters }),
		},
	),
);
