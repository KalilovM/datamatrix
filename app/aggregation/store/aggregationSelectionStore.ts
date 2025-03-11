"use client";

import { create } from "zustand";
import type { AggregationConfig, NomenclatureOption } from "../model/types";

interface AggregationSelectionState {
	selectedNomenclature: NomenclatureOption | null;
	selectedConfiguration: AggregationConfig | null;
	configurations: AggregationConfig[];

	setSelectedNomenclature: (nomenclature: NomenclatureOption) => void;
	setSelectedConfiguration: (config: AggregationConfig) => void;
	setConfigurations: (configs: AggregationConfig[]) => void;
}

export const useAggregationSelectionStore = create<AggregationSelectionState>(
	(set) => ({
		selectedNomenclature: null,
		selectedConfiguration: null,
		configurations: [],
		setSelectedNomenclature: (nomenclature) =>
			set({
				selectedNomenclature: nomenclature,
				selectedConfiguration: null,
				configurations: [],
			}),
		setSelectedConfiguration: (config) =>
			set({ selectedConfiguration: config }),
		setConfigurations: (configs) => set({ configurations: configs }),
	}),
);
