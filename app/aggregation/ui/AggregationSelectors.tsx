"use client";

import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useConfigurations } from "../api/configurationApi";
import type { AggregationConfig, NomenclatureOption } from "../model/types";
import { useAggregationSelectionStore } from "../store/aggregationSelectionStore";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface AggregationSelectorsProps {
	options: NomenclatureOption[];
}

export default function AggregationSelectors({
	options,
}: AggregationSelectorsProps) {
	const {
		selectedNomenclature,
		setSelectedNomenclature,
		selectedConfiguration,
		setSelectedConfiguration,
		configurations,
		setConfigurations,
		reset,
	} = useAggregationSelectionStore();
	const queryClient = useQueryClient();

	useEffect(() => {
		reset();
	}, [reset]);

	const { data: fetchedConfigurations } = useConfigurations(
		selectedNomenclature?.id || null,
	);

	useEffect(() => {
		if (fetchedConfigurations) {
			setConfigurations(fetchedConfigurations);
		}
	}, [fetchedConfigurations, setConfigurations]);

	const nomenclatureOptions = options.map((nom) => ({
		label: `${nom.modelArticle} - ${nom.color}` || "Без имени",
		value: nom,
	}));

	const configurationOptions = configurations.map((config) => ({
		label: `1-${config.pieceInPack}-${config.packInPallet}`,
		value: config,
	}));

	const handleNomenclatureChange = (
		option: { label: string; value: NomenclatureOption } | null,
	) => {
		setSelectedNomenclature(option ? option.value : null);
		queryClient.invalidateQueries({
			queryKey: ["configurations", selectedNomenclature?.id],
		});
	};

	const handleConfigurationChange = (
		option: { label: string; value: AggregationConfig } | null,
	) => {
		setSelectedConfiguration(option ? option.value : null);
	};

	return (
		<div className="gap-4 flex flex-col print:hidden">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">Агрегация</h1>
			</div>
			<div className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
				<div className="w-1/2 flex flex-col">
					<label htmlFor="nomenclatures">Модель</label>
					<Select
						name="nomenclatures"
						options={nomenclatureOptions}
						onChange={handleNomenclatureChange}
						value={
							selectedNomenclature
								? {
										label: selectedNomenclature.modelArticle,
										value: selectedNomenclature,
									}
								: null
						}
						placeholder="Выберите номенклатуру"
					/>
				</div>
				<div className="w-1/2 flex flex-col">
					<label htmlFor="configurations">Конфигурация</label>
					<Select
						name="configurations"
						options={configurationOptions}
						onChange={handleConfigurationChange}
						value={
							selectedConfiguration
								? {
										label: `1-${selectedConfiguration.pieceInPack}-${selectedConfiguration.packInPallet}`,
										value: selectedConfiguration,
									}
								: null
						}
						placeholder="Выберите конфигурацию"
						isDisabled={!selectedNomenclature}
					/>
				</div>
			</div>
		</div>
	);
}
