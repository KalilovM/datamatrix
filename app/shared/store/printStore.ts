"use client";

import { create } from "zustand";

interface PrintState {
	printCodes: string[];
	shouldPrint: boolean;
	setPrintCodes: (codes: string[]) => void;
	triggerPrint: () => void;
	resetPrint: () => void;
}

export const usePrintStore = create<PrintState>((set) => ({
	printCodes: [],
	shouldPrint: false,
	setPrintCodes: (codes) => set({ printCodes: codes }),
	triggerPrint: () => set({ shouldPrint: true }),
	resetPrint: () => set({ shouldPrint: false, printCodes: [] }),
}));
