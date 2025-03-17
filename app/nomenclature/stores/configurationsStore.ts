import { create } from "zustand";

interface Configuration {
	label: string;
	value: {
		pieceInPack: number;
		packInPallet: number;
	};
}

interface ConfigurationsState {
	configurations: Configuration[];
	addConfiguration: (config: Configuration) => void;
	updateConfiguration: (label: string, updatedConfig: Configuration) => void;
	removeConfiguration: (label: string) => void;
	reset: () => void;
}

export const useConfigurationsStore = create<ConfigurationsState>((set) => ({
	configurations: [],
	addConfiguration: (config) =>
		set((state) => ({
			configurations: [...state.configurations, config],
		})),
	updateConfiguration: (label, updatedConfig) =>
		set((state) => ({
			configurations: state.configurations.map((config) =>
				config.label === label ? updatedConfig : config,
			),
		})),
	removeConfiguration: (label) =>
		set((state) => ({
			configurations: state.configurations.filter(
				(config) => config.label !== label,
			),
		})),
	reset: () => set({ configurations: [] }),
}));
