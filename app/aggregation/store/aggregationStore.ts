"use client";

import { useMemo } from "react";
import { create } from "zustand";
import type {
	AggregationConfig,
	NomenclatureOption,
	PackPage,
} from "../model/types";

interface AggregationState {
	selectedNomenclature: NomenclatureOption | null;
	selectedConfiguration: AggregationConfig | null;
	configurations: AggregationConfig[];
	pages: PackPage[];
	currentPage: number;

	setSelectedNomenclature: (nomenclature: NomenclatureOption | null) => void;
	setSelectedConfiguration: (config: AggregationConfig | null) => void;
	setConfigurations: (configs: AggregationConfig[]) => void;
	setPages: (pages: PackPage[]) => void;
	setCurrentPage: (page: number) => void;
	updatePackValue: (index: number, value: string) => void;
	setUniqueCode: (pageIndex: number, code: string) => void;
	resetAggregation: () => void;
}

export const useAggregationStore = create<AggregationState>((set) => ({
	selectedNomenclature: null,
	selectedConfiguration: null,
	configurations: [],
	pages: [],
	currentPage: 0,

	setSelectedNomenclature: (nomenclature) =>
		set({
			selectedNomenclature: nomenclature,
			selectedConfiguration: null, // Reset config on nomenclature change
			configurations: [],
		}),
	setPages: (pages) => set({ pages }),
	setCurrentPage: (page) => set({ currentPage: page }),
	updatePackValue: (index, value) =>
		set((state) => {
			const pages = [...state.pages];
			if (!pages[state.currentPage]) return state;
			pages[state.currentPage].packValues[index] = value;
			return { pages };
		}),
	setUniqueCode: (pageIndex, code) =>
		set((state) => {
			const pages = [...state.pages];
			pages[pageIndex].uniqueCode = code;
			return { pages };
		}),
	setSelectedConfiguration: (config) => set({ selectedConfiguration: config }),
	setConfigurations: (configs) => set({ configurations: configs }),

	resetAggregation: () =>
		set({ selectedNomenclature: null, selectedConfiguration: null }),
}));

export const useAggregationSelector = () => {
	const store = useAggregationStore();

	return useMemo(
		() => ({
			selectedNomenclature: store.selectedNomenclature,
			selectedConfiguration: store.selectedConfiguration,
			setSelectedNomenclature: store.setSelectedNomenclature,
			setSelectedConfiguration: store.setSelectedConfiguration,
			setConfigurations: store.setConfigurations,
			resetAggregation: store.resetAggregation,
			configurations: store.configurations,
			pages: store.pages,
			currentPage: store.currentPage,
			setPages: store.setPages,
			setCurrentPage: store.setCurrentPage,
			updatePackValue: store.updatePackValue,
			setUniqueCode: store.setUniqueCode,
		}),
		[
			store.selectedNomenclature,
			store.selectedConfiguration,
			store.resetAggregation,
			store.setSelectedConfiguration,
			store.setSelectedNomenclature,
			store.setConfigurations,
			store.configurations,
			store.pages,
			store.currentPage,
			store.setPages,
			store.setCurrentPage,
			store.updatePackValue,
			store.setUniqueCode,
		],
	);
};
