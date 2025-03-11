"use client";

import { create } from "zustand";
import type { AggregationConfig, NomenclatureOption } from "../model/types";

interface AggregationSelectionState {
	selectedNomenclature: NomenclatureOption | null;
	selectedConfiguration: AggregationConfig | null;
	configurations: AggregationConfig[];

	setSelectedNomenclature: (nomenclature: NomenclatureOption | null) => void;
	setSelectedConfiguration: (config: AggregationConfig | null) => void;
	setConfigurations: (configs: AggregationConfig[]) => void;
	resetSelection: () => void;
}

export const useAggregationSelectionStore = create<AggregationSelectionState>(
	(set) => ({
		selectedNomenclature: null,
		selectedConfiguration: null,
		configurations: [],
		setSelectedNomenclature: (nomenclature) =>
			set({
				selectedNomenclature: nomenclature,
				// Reset configuration on nomenclature change
				selectedConfiguration: null,
				configurations: [],
			}),
		setSelectedConfiguration: (config) =>
			set({ selectedConfiguration: config }),
		setConfigurations: (configs) => set({ configurations: configs }),
		resetSelection: () =>
			set({
				selectedNomenclature: null,
				selectedConfiguration: null,
				configurations: [],
			}),
	}),
);
