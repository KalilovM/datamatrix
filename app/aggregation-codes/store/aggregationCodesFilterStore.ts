import { create } from "zustand";
import type { Filters } from "../definitions";

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
  generatedCode: "",
};

export const useAggregationCodesFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
