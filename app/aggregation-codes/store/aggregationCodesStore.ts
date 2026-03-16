"use client";

import type { IAggregatedCode } from "../definitions";
import { create } from "zustand";

interface PrintState {
	nomenclature: IAggregatedCode | null;
	setNomenclature: (nomenclature: IAggregatedCode) => void;
}

export const useAggregationCodesStore = create<PrintState>((set) => ({
	nomenclature: null,
	setNomenclature: (nomenclature) => set({ nomenclature }),
}));
