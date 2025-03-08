"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { AggregationConfig, NomenclatureOption } from "../model/types";
import { useAggregationSelector } from "../store/aggregationStore";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface AggregationSelectorsProps {
	options?: NomenclatureOption[];
}

export default function AggregationSelectors({
	options = [],
}: AggregationSelectorsProps) {
	const {
		selectedConfiguration,
		setSelectedConfiguration,
		selectedNomenclature,
		setSelectedNomenclature,
		resetAggregation,
	} = useAggregationSelector();

	const nomenclatureOptions = useMemo(
		() =>
			options.map((nom) => ({
				label: nom.name || "Без имени",
				value: nom,
			})),
		[options],
	);

	const configurationOptions = useMemo(
		() =>
			selectedNomenclature?.configurations
				? selectedNomenclature.configurations.map((config) => ({
						label: `1-${config.pieceInPack}-${config.packInPallet}`,
						value: config,
					}))
				: [],
		[selectedNomenclature],
	);

	const handleNomenclatureChange = (
		option: { label: string; value: NomenclatureOption } | null,
	) => {
		setSelectedNomenclature(option?.value || null);
	};

	const handleConfigurationChange = (
		option: { label: string; value: AggregationConfig } | null,
	) => {
		setSelectedConfiguration(option?.value || null);
	};

	return (
		<div className="gap-4 flex flex-col">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">Агрегация</h1>
				<button
					className="text-red-500 hover:text-red-700"
					onClick={resetAggregation}
				>
					Сбросить
				</button>
			</div>
			<div className="flex flex-col w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
				<div className="flex flex-row w-full gap-4">
					{/* Номенклатура Select */}
					<div className="w-1/2 flex flex-col">
						<label htmlFor="nomenclature">Номенклатура</label>
						<Select
							options={nomenclatureOptions}
							value={
								selectedNomenclature
									? {
											label: selectedNomenclature.name,
											value: selectedNomenclature,
										}
									: null
							}
							onChange={handleNomenclatureChange}
							placeholder="Выберите номенклатуру"
						/>
					</div>
					{/* Конфигурация Select */}
					<div className="w-1/2 flex flex-col">
						<label htmlFor="configuration">Конфигурация</label>
						<Select
							options={configurationOptions}
							value={
								selectedConfiguration
									? {
											label: `1-${selectedConfiguration.pieceInPack}-${selectedConfiguration.packInPallet}`,
											value: selectedConfiguration,
										}
									: null
							}
							onChange={handleConfigurationChange}
							placeholder="Выберите конфигурацию"
							isDisabled={!selectedNomenclature}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
