"use client";

import type { Nomenclature } from "@prisma/client";
import { create } from "zustand";

interface PrintState {
	nomenclature: Nomenclature | null;
	setNomenclature: (nomenclature: Nomenclature) => void;
}

export const useAggregationCodesStore = create<PrintState>((set) => ({
	nomenclature: null,
	setNomenclature: (nomenclature) => set({ nomenclature }),
}));
