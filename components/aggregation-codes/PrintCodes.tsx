"use client";

import BarcodeComponent from "../BarcodeComponent";
import { PrintingTemplate } from "@prisma/client";
import IAggregatedCode from "@/app/aggregation-codes/defenitions";
import { useEffect } from "react";

interface PrintCodesProps {
  aggregatedCodes: IAggregatedCode;
  printingTemplate: PrintingTemplate | null | never[];
  onPrintComplete: () => void;
  type: "qr" | "datamatrix";
}

const PrintCodes: React.FC<PrintCodesProps> = ({
  aggregatedCodes,
  printingTemplate,
  onPrintComplete,
  type = "qr",
}) => {
  useEffect(() => {
    window.print();
    onPrintComplete();
  }, [onPrintComplete]);
  const getFieldValue = (code: IAggregatedCode, fieldType: string) => {
    switch (fieldType) {
      case "NAME":
        return code?.name || "";
      case "MODEL_ARTICLE":
        return code?.modelArticle || "";
      case "COLOR":
        return code?.color || "";
      case "SIZE":
        return code?.size || "";
      default:
        return "";
    }
  };
  const fieldLabels = {
    NAME: "Наименование",
    MODEL_ARTICLE: "Модель/Артикул",
    COLOR: "Цвет",
    SIZE: "Размер",
  };

  if (!aggregatedCodes || !printingTemplate || printingTemplate.length === 0)
    return null;

  return (
    <div className="print-container printable print:block">
      {aggregatedCodes &&
        aggregatedCodes.codes.map((code, index) => {
          // Sort template fields based on the 'order' property
          const sortedFields = [...printingTemplate!.fields].sort(
            (a, b) => a.order - b.order,
          );

          // Build the QR/Generated Code column (40% width)
          const qrColumn = (
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarcodeComponent text={code} size={100} type={type} />
            </div>
          );

          // Build the fields column (60% width) from nomenclature data
          const fieldsColumn = (
            <div
              style={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 4mm",
                fontSize: "10px",
              }}
            >
              {sortedFields.map((field) => (
                <div key={field.id} style={{ marginBottom: "1mm" }}>
                  <strong>
                    {fieldLabels[field.fieldType] || field.fieldType}:
                  </strong>{" "}
                  {getFieldValue(aggregatedCodes, field.fieldType)}
                </div>
              ))}
            </div>
          );

          // Layout: QR column on left or right based on qrPosition setting
          return (
            <div
              key={index}
              className="print-page"
              style={{
                width: "58mm",
                height: "40mm",
                display: "flex",
                flexDirection: "row",
                boxSizing: "border-box",
                padding: "2mm",
              }}
            >
              {printingTemplate.qrPosition === "LEFT" ? (
                <>
                  {qrColumn}
                  {fieldsColumn}
                </>
              ) : (
                <>
                  {fieldsColumn}
                  {qrColumn}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default PrintCodes;
