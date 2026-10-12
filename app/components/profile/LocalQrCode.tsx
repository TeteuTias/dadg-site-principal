"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { TICKET_QR_OPTIONS } from "@/lib/profile/ticket";

export default function LocalQrCode({
  value,
  label = "QR Code pessoal",
}: {
  value: string;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!canvasRef.current) return;
    setError(false);
    QRCode.toCanvas(canvasRef.current, value, TICKET_QR_OPTIONS).catch(() =>
      setError(true),
    );
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
      aria-label={label}
      className="rounded-lg"
    />
  );
}
