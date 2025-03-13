"use client";

import type React from "react";

interface TextField {
	field: string;
	bold: boolean;
	size: number;
}

interface CanvasSize {
	width: string;
	height: string;
}

interface PrintingPreviewProps {
	textFields: TextField[];
	qrPosition: "left" | "right" | "center" | string;
	canvasSize: CanvasSize;
}

const TEXT_FIELD_LABEL = {
	name: "Имя",
	modelArticle: "Модель/Артикул",
	color: "Цвет",
	size: "Размер",
};

const PrintingPreview: React.FC<PrintingPreviewProps> = ({
	textFields,
	qrPosition,
	canvasSize,
}) => {
	// Prepare the container style based on canvasSize
	const containerStyle = {
		width: canvasSize.width,
		height: canvasSize.height,
	};

	// Renders a simple QR placeholder.
	const renderQRCode = () => (
		<div className="flex items-center justify-center border p-4 w-full h-full">
			<span>QR Code</span>
		</div>
	);

	// Renders text fields as previewed text with the given font size and weight.
	const renderTextFields = () => (
		<div className="flex flex-col gap-2 p-2 w-full h-full">
			{textFields.map((tf, index) => {
				if (!tf.field) return null;
				console.log(textFields);
				return (
					<div
						key={index}
						style={{
							fontSize: `${tf.size}px`,
							fontWeight: tf.bold ? "bold" : "normal",
						}}
						className="w-full h-full flex items-center"
					>
						{TEXT_FIELD_LABEL[tf.field]}
					</div>
				);
			})}
		</div>
	);

	if (qrPosition === "center") {
		return (
			<div
				style={containerStyle}
				className="border p-1 flex flex-col items-center bg-white mx-auto gap-2"
			>
				{/* QR code centered and taking 50% of the width */}
				<div className="w-1/2 h-full">{renderQRCode()}</div>
				<div>{renderTextFields()}</div>
			</div>
		);
	}

	if (qrPosition === "left") {
		return (
			<div style={containerStyle} className="border p-1 flex bg-white mx-auto">
				{/* Left side: QR code (50% width) */}
				<div className="w-1/2">{renderQRCode()}</div>
				{/* Right side: Text fields */}
				<div className="w-1/2">{renderTextFields()}</div>
			</div>
		);
	}

	// Default to "right" if not center or left.
	return (
		<div style={containerStyle} className="border p-1 flex bg-white mx-auto">
			{/* Left side: Text fields */}
			<div className="w-1/2">{renderTextFields()}</div>
			{/* Right side: QR code (50% width) */}
			<div className="w-1/2">{renderQRCode()}</div>
		</div>
	);
};

export default PrintingPreview;
