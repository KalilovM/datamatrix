import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 p-4">
      <button
        className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        Назад
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-2 border rounded-lg ${
            currentPage === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Вперед
      </button>
    </div>
  );
};

export default PaginationControls;
