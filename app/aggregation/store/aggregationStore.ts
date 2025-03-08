"use client";

import { useMemo } from "react";
import { create } from "zustand";
import type { AggregationConfig, NomenclatureOption } from "../model/types";

interface AggregationState {
	selectedNomenclature: NomenclatureOption | null;
	selectedConfiguration: AggregationConfig | null;

	setSelectedNomenclature: (nomenclature: NomenclatureOption | null) => void;
	setSelectedConfiguration: (config: AggregationConfig | null) => void;
	resetAggregation: () => void;
}

export const useAggregationStore = create<AggregationState>((set) => ({
	selectedNomenclature: null,
	selectedConfiguration: null,

	setSelectedNomenclature: (nomenclature) =>
		set({
			selectedNomenclature: nomenclature,
			selectedConfiguration: null, // Reset config on nomenclature change
		}),

	setSelectedConfiguration: (config) => set({ selectedConfiguration: config }),

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
			resetAggregation: store.resetAggregation,
		}),
		[
			store.selectedNomenclature,
			store.selectedConfiguration,
			store.resetAggregation,
			store.setSelectedConfiguration,
			store.setSelectedNomenclature,
		],
	);
};
