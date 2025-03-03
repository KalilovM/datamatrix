import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeComponentProps {
  text: string;
  size?: number;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  text,
  size = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, { width: size }, (error) => {
        if (error) console.error("QR Code generation error:", error);
      });
    }
  }, [text, size]);

  return <canvas ref={canvasRef} />;
};

export default QRCodeComponent;
