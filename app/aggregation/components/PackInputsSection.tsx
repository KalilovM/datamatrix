import React, { useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import PackInputsList from "./PackInputsList";
import PaginationControls from "./PaginationControls";
import { useAggregationStore } from "../store";
import { generatePackCode } from "../actions";

const PackInputsSection: React.FC = () => {
  const {
    selectedConfiguration,
    pages,
    setPages,
    currentPage,
    setCurrentPage,
  } = useAggregationStore();

  useEffect(() => {
    if (selectedConfiguration) {
      setPages([
        {
          packValues: Array(selectedConfiguration.pieceInPack).fill(""),
          uniqueCode: null,
        },
      ]);
      setCurrentPage(0);
    }
  }, [selectedConfiguration]);

  const mutation = useMutation({
    mutationFn: generatePackCode,
    onSuccess: (data) => {
      setPages((prevPages) => {
        const newPages = [...prevPages];
        newPages[currentPage].uniqueCode = data.value;
        return newPages;
      });
      toast.success("Уникальный код успешно создан!");
    },
    onError: () => {
      toast.error("Ошибка при генерации кода");
    },
  });

  useEffect(() => {
    const currentData = pages[currentPage];
    if (
      currentData?.packValues.every((val) => val !== "") &&
      !currentData.uniqueCode
    ) {
      mutation.mutate({
        packCodes: currentData.packValues,
        configurationId: selectedConfiguration!.id,
        nomenclatureId: selectedConfiguration!.nomenclatureId,
      });
    }
  }, [pages, currentPage]);

  return (
    <div className="flex flex-col gap-4">
      <PackInputsList />
      <PaginationControls />
    </div>
  );
};

export default PackInputsSection;
