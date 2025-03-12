"use client";

import { usePrintStore } from "@/shared/store/printStore";
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
		setCodes,
	} = useAggregationPackStore();

	const { setPrintCodes, triggerPrint } = usePrintStore();

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
						// Update the print store with the generated codes
						setPrintCodes([data.value]);
						triggerPrint();

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
		setPrintCodes,
	]);
}
