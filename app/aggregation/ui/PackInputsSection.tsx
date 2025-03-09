"use client";

import PrintCodes from "@/components/aggregation-codes/PrintCodes";
import { PrintIcon } from "@/shared/ui/icons";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useGeneratePackCode } from "../api/generatePackApi";
import type { PackPage, PrintTemplate } from "../model/types";
import { useAggregationStore } from "../store/aggregationStore";
import PackInputsList from "./PackInputsList";
import PaginationControls from "./PaginationControls";

interface Props {
	printTemplate: PrintTemplate | undefined;
}

export default function PackInputsSection({ printTemplate }: Props) {
	const {
		selectedNomenclature,
		selectedConfiguration,
		pages,
		currentPage,
		setPages,
		setCurrentPage,
		setUniqueCode,
		codes,
		setCodes,
	} = useAggregationStore();

	const mutation = useGeneratePackCode();
	const mutationTriggered = useRef(false);
	const lastGeneratedCode = pages[currentPage]?.uniqueCode;

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
						window.print();
						setCodes(currentData.packValues);

						const newPage: PackPage = {
							packValues: Array(selectedConfiguration?.pieceInPack || 0).fill(
								"",
							),
							uniqueCode: null,
						};

						const updatedPages = [...pages, newPage];

						setPages(updatedPages);
						setCurrentPage(currentPage + 1);

						mutationTriggered.current = false;
					},
					onError: (error) => {
						console.log(error);
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
	]);

	return (
		<div className="flex flex-col gap-4 w-1/2 h-full justify-between bg-white rounded-md border border-blue-300 p-4 print:border-none print:h-auto">
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold print:hidden">Пачки</h2>

				{lastGeneratedCode && (
					<div className="bg-green-100 text-green-800 p-3 rounded-md text-left font-semibold flex justify-between items-center print:hidden">
						{/* Left side: Unique Code */}
						<div>
							<span>Уникальный код:</span>
							<br />
							<span className="font-bold">{lastGeneratedCode}</span>
						</div>

						{/* Right side: Print Button */}
						<button
							type="button"
							className="p-2 bg-green-200 hover:bg-green-300 rounded-md"
							onClick={() => window.print()} // Replace with actual print function
							aria-label="Print Unique Code"
						>
							<PrintIcon className="size-6" />
						</button>
					</div>
				)}

				<PackInputsList />
				<PrintCodes
					printTemplate={printTemplate}
					selectedNomenclature={selectedNomenclature}
					codes={codes}
				/>
			</div>
			<PaginationControls />
		</div>
	);
}
