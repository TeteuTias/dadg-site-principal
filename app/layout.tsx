import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

 
import MenuDrawer from "./MenuDrawer"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {/* Componente Client que contém a interatividade */}
        <MenuDrawer />

        {/* Conteúdo Principal com margem para não ser escondido pela barra */}
        <div style={{ marginTop: "60px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}