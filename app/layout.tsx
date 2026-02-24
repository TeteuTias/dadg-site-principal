import type { Metadata } from "next";

import "./globals.css";
import MenuDrawer from "./components/MenuDrawer";

export const metadata: Metadata = {
  title: "@dadg.imepac",
  description: "Bem vindo(a) ao site do Dadg Imepac Araguari!",
  icons: {
    icon: "/logoDadg02.ico"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {/* Componente Client que contém a interatividade */}
        <MenuDrawer />
        {/* Conteúdo Principal com padding para evitar sobreposição do header */}
        <div className="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
