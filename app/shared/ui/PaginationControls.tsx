"use client";

import { ChevronRightIcon } from "@/shared/ui/icons";

const SIBLING_PAGE_COUNT = 5;

export function getPaginationPages(currentPage: number, totalPages: number) {
	const safeTotalPages = Math.max(1, totalPages);
	const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

	let startPage = Math.max(1, safeCurrentPage - SIBLING_PAGE_COUNT);
	let endPage = Math.min(safeTotalPages, safeCurrentPage + SIBLING_PAGE_COUNT);

	const missingPreviousPages = SIBLING_PAGE_COUNT - (safeCurrentPage - startPage);
	const missingNextPages = SIBLING_PAGE_COUNT - (endPage - safeCurrentPage);

	if (missingPreviousPages > 0) {
		endPage = Math.min(safeTotalPages, endPage + missingPreviousPages);
	}

	if (missingNextPages > 0) {
		startPage = Math.max(1, startPage - missingNextPages);
	}

	return Array.from(
		{ length: endPage - startPage + 1 },
		(_, index) => startPage + index,
	);
}

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	previousLabel: string;
	nextLabel: string;
	pageLabel: (page: number) => string;
}

export default function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
	previousLabel,
	nextLabel,
	pageLabel,
}: PaginationControlsProps) {
	const pages = getPaginationPages(currentPage, totalPages);

	return (
		<div className="flex flex-wrap items-center justify-end gap-2">
			<button
				type="button"
				disabled={currentPage === 1}
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				aria-label={previousLabel}
				title={previousLabel}
				className="flex size-9 items-center justify-center rounded border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronRightIcon className="size-4 rotate-180" />
			</button>
			<div className="flex flex-wrap items-center gap-1">
				{pages.map((page) => {
					const isCurrentPage = page === currentPage;

					return (
						<button
							type="button"
							key={page}
							onClick={() => onPageChange(page)}
							aria-current={isCurrentPage ? "page" : undefined}
							aria-label={pageLabel(page)}
							className={`flex h-9 min-w-9 items-center justify-center rounded border px-3 text-sm font-medium transition ${
								isCurrentPage
									? "border-blue-500 bg-blue-500 text-white"
									: "border-gray-300 text-gray-700 hover:bg-gray-100"
							}`}
						>
							{page}
						</button>
					);
				})}
			</div>
			<button
				type="button"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				aria-label={nextLabel}
				title={nextLabel}
				className="flex size-9 items-center justify-center rounded border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronRightIcon className="size-4" />
			</button>
		</div>
	);
}
