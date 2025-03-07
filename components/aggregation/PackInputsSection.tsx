import React, { useState, useRef, useEffect, useCallback } from "react";
import PackInput from "../../app/aggregation/components/PackInput";
import PaginationControls from "../../app/aggregation/components/PaginationControls";
import { toast } from "react-toastify";
import { Configuration } from "./defenitions";

//TODO: use state manager to reduce the code complexity

interface PageData {
  packValues: string[];
  uniqueCode: string | null;
}

interface PackInputsSectionProps {
  selectedConfiguration: Configuration | null;
}

const PackInputsSection: React.FC<PackInputsSectionProps> = ({
  selectedConfiguration,
}) => {
  // Store all pages of data; currentPage is 0-indexed.
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState<number | null>(null);
  const packRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Initialize pages when the configuration changes.
  useEffect(() => {
    if (selectedConfiguration) {
      const initialPage: PageData = {
        packValues: Array(selectedConfiguration.pieceInPack).fill(""),
        uniqueCode: null,
      };
      setPages([initialPage]);
      setCurrentPage(0);
      setLastUpdatedIndex(null);
      packRefs.current = [];
    }
  }, [selectedConfiguration]);

  // Submit the pack data for the current page.
  const submitPackData = useCallback(async () => {
    if (!selectedConfiguration) return;
    const currentPageData = pages[currentPage];
    if (!currentPageData) return;
    try {
      const res = await fetch("/api/aggregations/generate-pack-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packCodes: currentPageData.packValues,
          configurationId: selectedConfiguration.id,
          nomenclatureId: selectedConfiguration.nomenclatureId,
        }),
      });
      if (!res.ok) throw new Error("Ошибка при генерации кода");
      const data = await res.json();
      // Update the unique code for the current page.
      setPages((prevPages) => {
        const newPages = [...prevPages];
        newPages[currentPage] = {
          ...newPages[currentPage],
          uniqueCode: data.value,
        };
        return newPages;
      });
      toast.success("Уникальный код успешно создан!");
    } catch (error) {
      toast.error("Ошибка при отправке данных на сервер");
      console.error("Ошибка при отправке данных на сервер", error);
    }
  }, [pages, currentPage, selectedConfiguration]);

  // Trigger submission when all inputs on the current page are filled and the unique code is not set.
  useEffect(() => {
    const currentPageData = pages[currentPage];
    if (
      currentPageData &&
      currentPageData.packValues.every((val) => val !== "") &&
      !currentPageData.uniqueCode
    ) {
      toast.success("Все поля заполнены, отправляем данные...");
      submitPackData();
    }
  }, [pages, currentPage, submitPackData]);

  // When the current page has been submitted (i.e. uniqueCode exists) and it's the last page, add a new page.
  useEffect(() => {
    const currentPageData = pages[currentPage];
    if (
      currentPageData &&
      currentPageData.packValues.every((val) => val !== "") &&
      currentPageData.uniqueCode
    ) {
      // Only add a new page if we're on the last page.
      if (currentPage === pages.length - 1 && selectedConfiguration) {
        const newPage: PageData = {
          packValues: Array(selectedConfiguration.pieceInPack).fill(""),
          uniqueCode: null,
        };
        setPages((prevPages) => [...prevPages, newPage]);
      }
    }
  }, [pages, currentPage, selectedConfiguration]);

  // Optionally, auto-move to the next page after the current one is fully submitted.
  useEffect(() => {
    const currentPageData = pages[currentPage];
    if (currentPageData && currentPageData.uniqueCode) {
      if (currentPage < pages.length - 1) {
        // setCurrentPage(currentPage + 1);
      }
    }
  }, [pages, currentPage]);

  // Focus on the next empty input on the current page.
  const focusNextInput = useCallback(
    (currentIndex: number) => {
      const currentData = pages[currentPage];
      if (!currentData) return;
      const nextIndex = currentData.packValues.findIndex(
        (val, i) => val === "" && i > currentIndex,
      );
      if (nextIndex !== -1 && packRefs.current[nextIndex]) {
        packRefs.current[nextIndex]?.focus();
      }
    },
    [pages, currentPage],
  );

  useEffect(() => {
    if (lastUpdatedIndex !== null) {
      focusNextInput(lastUpdatedIndex);
    }
  }, [lastUpdatedIndex, focusNextInput]);

  // Validate scanned code and update the packValues for the current page.
  const validateCode = async (
    index: number,
    value: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/codes/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      const data = await res.json();
      if (!data.exists) {
        toast.error("Код не найден в БД");
        return false;
      }
      const currentData = pages[currentPage];
      if (currentData.packValues.includes(value)) {
        toast.error("Код уже в списке");
        return false;
      }
      // Update the current page's packValues.
      setPages((prevPages) => {
        const newPages = [...prevPages];
        const updatedPage = { ...newPages[currentPage] };
        updatedPage.packValues[index] = value;
        newPages[currentPage] = updatedPage;
        return newPages;
      });
      setLastUpdatedIndex(index);
      return true;
    } catch (error) {
      toast.error("Ошибка проверки кода");
      console.error("Ошибка проверки кода", error);
      return false;
    }
  };

  // Clear an input and reset the unique code for the current page.
  const handlePackInputClear = (index: number) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      const updatedPage = { ...newPages[currentPage] };
      updatedPage.packValues[index] = "";
      // Reset unique code since an input has changed.
      updatedPage.uniqueCode = null;
      newPages[currentPage] = updatedPage;
      return newPages;
    });
    packRefs.current[index]?.focus();
  };

  // Render pack inputs for the current page.
  const renderPackInputs = () => {
    const currentData = pages[currentPage];
    if (!selectedConfiguration || !currentData) {
      return (
        <p className="px-8 py-3">Выберите конфигурацию для отображения пачек</p>
      );
    }
    return currentData.packValues.map((value, index) => (
      <PackInput
        key={`${currentPage}-${index}`}
        index={index}
        value={value}
        onValidScan={validateCode}
        onClear={() => handlePackInputClear(index)}
        inputRef={(el) => (packRefs.current[index] = el)}
      />
    ));
  };

  // Copy the unique code for the current page to the clipboard.
  const handleCopyUniqueCode = useCallback(() => {
    const currentData = pages[currentPage];
    if (currentData?.uniqueCode) {
      navigator.clipboard
        .writeText(currentData.uniqueCode)
        .then(() => {
          toast.success("Datamatrix код скопирован в буфер обмена!");
        })
        .catch(() => {
          toast.error("Не удалось скопировать Datamatrix код.");
        });
    }
  }, [pages, currentPage]);

  return (
    <div className="table-layout flex flex-col h-full">
      <div className="table-header flex justify-between items-center">
        <p className="table-header-title">Пачки (Страница {currentPage + 1})</p>
      </div>
      <div className="table-rows-layout flex-1">{renderPackInputs()}</div>
      {pages[currentPage]?.uniqueCode && (
        <div
          onClick={handleCopyUniqueCode}
          className="p-4 border rounded-sm bg-gray-100 flex flex-col justify-start text-start items-start cursor-pointer select-none"
        >
          <p className="text-lg font-semibold">Уникальный код:</p>
          <p className="text-xl text-green-600 font-bold">
            {pages[currentPage].uniqueCode}
          </p>
        </div>
      )}
      <PaginationControls
        currentPage={currentPage + 1}
        totalPages={pages.length}
        onPageChange={(page) => {
          const newIndex = page - 1;
          if (newIndex < pages.length) {
            setCurrentPage(newIndex);
          }
        }}
      />
    </div>
  );
};

export default PackInputsSection;
