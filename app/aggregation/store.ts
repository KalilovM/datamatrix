import { create } from "zustand";
import { Configuration, PageData } from "./types";

interface AggregationState {
  selectedConfiguration: Configuration | null;
  setSelectedConfiguration: (config: Configuration | null) => void;

  pages: PageData[];
  setPages: (pages: PageData[]) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useAggregationStore = create<AggregationState>((set) => ({
  selectedConfiguration: null,
  setSelectedConfiguration: (config) => set({ selectedConfiguration: config }),

  pages: [],
  setPages: (pages) => set({ pages }),

  currentPage: 0,
  setCurrentPage: (page) => set({ currentPage: page }),
}));
