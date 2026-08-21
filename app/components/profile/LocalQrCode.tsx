"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

export default function LocalQrCode({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!canvasRef.current) return;
    setError(false);
    QRCode.toCanvas(canvasRef.current, value, {
      width: 180,
      margin: 2,
      color: { dark: "#ffffff", light: "#0f172a" },
      errorCorrectionLevel: "M",
    }).catch(() => setError(true));
  }, [value]);
  if (error)
    return (
      <p role="alert" className="text-xs text-rose-300">
        Não foi possível gerar o QR Code.
      </p>
    );
  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="QR Code do ingresso"
      className="rounded-lg"
    />
  );
}
