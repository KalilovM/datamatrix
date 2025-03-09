import type React from "react";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import bwipjs from "bwip-js";
import { parseBarcode } from "gs1-barcode-parser-mod";

interface BarcodeComponentProps {
	text: string;
	size?: number;
	type?: "QR" | "DATAMATRIX"; // Allow switching between QR and DataMatrix
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({
	text,
	size = 100,
	type = "QR",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [error, setError] = useState<string | null>(null);
	console.log(text);

	useEffect(() => {
		if (!canvasRef.current) return;

		if (type === "QR") {
			// Generate QR Code
			QRCode.toCanvas(canvasRef.current, text, { width: size }, (err) => {
				if (err) {
					console.error("QR Code generation error:", err);
					setError("Failed to generate QR code");
				}
			});
		} else if (type === "DATAMATRIX") {
			try {
				const canvas = canvasRef.current;
				const ctx = canvas.getContext("2d");
				const formattedText = text.replace("�", "");

				if (ctx) {
					// Generate GS1 DataMatrix using bwip-js
					console.log(parseBarcode(text.replace("�", "")));
					bwipjs.toCanvas(canvas, {
						bcid: "datamatrix", // DataMatrix barcode type
						text: formattedText, // The text to encode
						scale: 1, // Scale the barcode
						includetext: true, // Do not include text below barcode
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
