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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/*Barra Superior*/}
        <div
          style={{
            width: "100%",
            height: "50px",
            backgroundColor: "#2A5B8D",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          Diretório Acadêmico 
        </div>

        {/*Conteúdo Principal  Margem para Não Ser Escondido pela Barra */}
        <div style={{ marginTop: "60px" }}>
          {children}
        </div>

      </body>
    </html>
  );
}
