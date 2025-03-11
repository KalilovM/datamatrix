"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useGeneratePackCode } from "../api/generatePackApi";
import { useAggregationPackStore } from "../store/aggregationPackStore";
import { useAggregationSelectionStore } from "../store/aggregationSelectionStore";

export function usePackGeneration() {
	const mutation = useGeneratePackCode();
	const mutationTriggered = useRef(false);

	const { selectedConfiguration } = useAggregationSelectionStore();
	const {
		pages,
		currentPage,
		setPages,
		setCurrentPage,
		setUniqueCode,
		codes,
		setCodes,
	} = useAggregationPackStore();

	// When configuration changes, initialize pages
	useEffect(() => {
		if (selectedConfiguration) {
			setPages([
				{
					packValues: Array(selectedConfiguration.pieceInPack).fill(""),
					uniqueCode: null,
				},
			]);
			setCurrentPage(0);
			mutationTriggered.current = false;
		}
	}, [selectedConfiguration, setPages, setCurrentPage]);

	// Trigger pack code generation when all inputs are filled
	useEffect(() => {
		const currentData = pages[currentPage];
		if (!currentData || currentData.uniqueCode) return;

		if (
			currentData.packValues.every((val) => val !== "") &&
			!mutationTriggered.current
		) {
			mutationTriggered.current = true;
			mutation.mutate(
				{
					packCodes: currentData.packValues,
					configurationId: selectedConfiguration!.id,
					nomenclatureId: selectedConfiguration!.nomenclatureId,
				},
				{
					onSuccess: (data) => {
						setUniqueCode(currentPage, data.value);
						toast.success("Уникальный код создан");
						setCodes(currentData.packValues);

						const newPage = {
							packValues: Array(selectedConfiguration!.pieceInPack).fill(""),
							uniqueCode: null,
						};

						const updatedPages = [...pages, newPage];
						setPages(updatedPages);
						setCurrentPage(currentPage + 1);
						mutationTriggered.current = false;
					},
					onError: (error: any) => {
						console.error(error);
						toast.error("Ошибка генерации кода");
						mutationTriggered.current = false;
					},
				},
			);
		}
	}, [
		pages,
		currentPage,
		selectedConfiguration,
		setUniqueCode,
		setPages,
		setCurrentPage,
		mutation,
		setCodes,
	]);

	useEffect(() => {
		if (
			codes &&
			selectedConfiguration &&
			codes.length === selectedConfiguration.pieceInPack
		) {
			window.print();
		}
	}, [codes, selectedConfiguration]);
}
