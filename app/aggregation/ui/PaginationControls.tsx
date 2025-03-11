"use client";

import { useAggregationPackStore } from "../store/aggregationPackStore";

export default function PaginationControls() {
	const { currentPage, pages, setCurrentPage } = useAggregationPackStore();

	const handlePrev = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < pages.length - 1) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className="flex justify-center gap-2 p-4 print:hidden">
			<button
				type="button"
				disabled={currentPage === 0}
				onClick={handlePrev}
				className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
			>
				Назад
			</button>
			<span className="px-3 py-2">{`Страница ${currentPage + 1} из ${pages.length}`}</span>
			<button
				type="button"
				disabled={currentPage >= pages.length - 1}
				onClick={handleNext}
				className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
			>
				Вперед
			</button>
		</div>
	);
}
