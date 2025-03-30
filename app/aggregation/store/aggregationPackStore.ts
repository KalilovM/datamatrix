"use client";

import { create } from "zustand";
import type { PackPage } from "../model/types";

interface AggregationPackState {
	codes: string[];
	pages: PackPage[];
	currentPage: number;

	setCodes: (codes: string[]) => void;
	setPages: (pages: PackPage[]) => void;
	setCurrentPage: (page: number) => void;
	setPrintSize: (size: string) => void;
	updatePackValue: (index: number, value: string) => void;
	setUniqueCode: (pageIndex: number, code: string) => void;
}

export const useAggregationPackStore = create<AggregationPackState>(
	(set, get) => ({
		codes: [],
		pages: [],
		currentPage: 0,
		setCodes: (codes) => set({ codes }),
		setPages: (pages) => set({ pages }),
		setCurrentPage: (page) => set({ currentPage: page }),
		setPrintSize: (size) => {
			set((state) => {
				const pages = [...state.pages];
				if (!pages[state.currentPage]) return {};
				pages[state.currentPage].size = size;
				return { pages };
			});
		},
		updatePackValue: (index, value) => {
			set((state) => {
				const pages = [...state.pages];
				if (!pages[state.currentPage]) return {};
				pages[state.currentPage].packValues[index] = value;
				return { pages };
			});
		},
		setUniqueCode: (pageIndex, code) => {
			set((state) => {
				const pages = [...state.pages];
				pages[pageIndex].uniqueCode = code;
				return { pages };
			});
		},
	}),
);
