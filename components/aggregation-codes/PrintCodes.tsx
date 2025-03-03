"use client";

import React, { useEffect } from "react";
import QRCodeComponent from "../QRCodeComponent";
import { PrintingTemplate } from "@prisma/client";
import IAggregatedCode from "@/app/aggregation-codes/defenitions";

interface PrintCodesProps {
  aggregatedCodes: IAggregatedCode[]; // Replace with your IAggregatedCode type
  printingTemplate: PrintingTemplate | null | never[];
  onPrintComplete: () => void;
}

const PrintCodes: React.FC<PrintCodesProps> = ({
  aggregatedCodes,
  printingTemplate,
  onPrintComplete,
}) => {
  useEffect(() => {
    console.log(...printingTemplate!.fields);
    const timer = setTimeout(() => {
      window.print();
      onPrintComplete();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const getFieldValue = (code: IAggregatedCode, fieldType: string) => {
    // Assuming aggregatedCodes include a nested nomenclature with these fields
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

  return (
    <div className="print-container printable">
      {aggregatedCodes[0].codes.map((code, index) => {
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
            <QRCodeComponent text={code} size={120} />
            <div
              style={{ marginTop: "2mm", fontSize: "10px" }}
              className="break-words w-full"
            >
              {code}
            </div>
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
                <strong>{field.fieldType}:</strong>{" "}
                {getFieldValue(aggregatedCodes[0], field.fieldType)}
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
              width: "305px",
              height: "228px",
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
