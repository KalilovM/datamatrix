import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import bwipjs from "bwip-js";

interface BarcodeComponentProps {
  text: string;
  size?: number;
  type?: "qr" | "datamatrix"; // Allow switching between QR and DataMatrix
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({
  text,
  size = 100,
  type = "qr",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (type === "qr") {
      // Generate QR Code
      QRCode.toCanvas(canvasRef.current, text, { width: size }, (err) => {
        if (err) {
          console.error("QR Code generation error:", err);
          setError("Failed to generate QR code");
        }
      });
    } else if (type === "datamatrix") {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Generate GS1 DataMatrix using bwip-js
          bwipjs.toCanvas(canvas, {
            bcid: "datamatrix", // DataMatrix barcode type
            text: text, // The text to encode
            scale: 1, // Scale the barcode
            includetext: false, // Do not include text below barcode
            parse: true, // Enable GS1 parsing for FNC1 separators
          });
        }
      } catch (err) {
        console.error("GS1 DataMatrix generation error:", err);
        setError("Failed to generate DataMatrix code");
      }
    }
  }, [text, size, type]);

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <canvas ref={canvasRef} />
      )}
    </div>
  );
};

export default BarcodeComponent;
