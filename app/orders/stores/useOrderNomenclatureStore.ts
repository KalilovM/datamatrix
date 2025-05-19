import { create } from "zustand";

interface IRow {
	id?: number;
	nomenclature: {
		id: string;
		label: string;
		value: string;
	} | null;
	numberOfOrders: number;
	numberOfPreparedOrders: number;
}

interface IOrderNomenclatureStore {
	rows: IRow[];
	setRows: (rows: IRow[]) => void;
	addRow: (row: IRow) => void;
	updateRow: (index: number, updatedRow: Partial<IRow>) => void;
	resetRows: () => void;
	removeRow: (index: number) => void;
	updatePreparedOrders: (
		codes: { nomenclature: string; codes: string[] }[],
	) => void;
}

export const useOrderNomenclatureStore = create<IOrderNomenclatureStore>(
	(set) => ({
		rows: [],
		setRows: (rows) => set({ rows }),
		addRow: (row) => set((state) => ({ rows: [...state.rows, row] })),
		updateRow: (index, updatedRow) =>
			set((state) => {
				const newRows = [...state.rows];
				newRows[index] = { ...newRows[index], ...updatedRow };
				return { rows: newRows };
			}),
		removeRow: (index) =>
			set((state) => {
				const newRows = [...state.rows];
				newRows.splice(index, 1);
				return { rows: newRows };
			}),
		resetRows: () => set({ rows: [] }),
		updatePreparedOrders: (codes) => {
			set((state) => {
				const newRows = state.rows.map((row) => {
					if (row.nomenclature?.value) {
						const numberOfPreparedOrders = codes
							.filter((code) => code.nomenclature === row.nomenclature!.value)
							.reduce((total, code) => total + code.codes.length, 0);
						return { ...row, numberOfPreparedOrders };
					}
					return row;
				});
				return { rows: newRows };
			});
		},
	}),
);
