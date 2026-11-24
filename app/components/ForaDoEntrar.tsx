"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Esconde partes do site (menu, rodapé, popup) na tela de login /entrar, que é "limpa". */
export default function ForaDoEntrar({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  return pathname === "/entrar" || pathname.startsWith("/entrar/") ? null : <>{children}</>;
}
