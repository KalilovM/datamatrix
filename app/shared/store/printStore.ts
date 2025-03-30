"use client";

import { create } from "zustand";

interface PrintState {
	printCodes: string[];
	size: string | null;
	shouldPrint: boolean;
	setPrintCodes: (codes: string[]) => void;
	setSize: (size: string) => void;
	triggerPrint: () => void;
	resetPrint: () => void;
}

export const usePrintStore = create<PrintState>((set) => ({
	printCodes: [],
	size: null,
	shouldPrint: false,
	setPrintCodes: (codes) => set({ printCodes: codes }),
	setSize: (size) => set({ size }),
	triggerPrint: () => set({ shouldPrint: true }),
	resetPrint: () => set({ shouldPrint: false, printCodes: [], size: null }),
}));
