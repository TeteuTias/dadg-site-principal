"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MenuDrawer() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clamSubmenuOpen, setClamSubmenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleClamSubmenu = () => setClamSubmenuOpen((prev) => !prev);

  const clamSubmenuItems = [
    "LACOHP",
    "LAFIM",
    "LAPS",
    "LAPA",
    "LAI",
    "LAFARM",
    "LAME",
    "LAMFAC",
    "LAIC",
    "LIGAMI",
    "LAPLAST",
    "LACCA",
    "LAMELP",
    "LAOT",
    "UROLIGA",
    "LUMA",
    "LUME",
    "LUCMSC",
    "LAGASTRO",
    "LAGEM",
    "LANUT",
    "LASEM",
    "LAAD",
    "LACOR",
    "LADERM",
    "LAGO",
    "LANE",
    "LAONCO",
    "LANEFRO",
    "LAR",
    "LUPA",
    "LAARD",
    "LAOTO",
    "LAOA",
    "LIAP",
    "LAE"
  ];

  // Calcula a altura máxima para o submenu (aprox. 30px por item)
  const submenuMaxHeight = clamSubmenuOpen
    ? `${clamSubmenuItems.length * 30}px`
    : "0px";

  return (
    <>
      {/* Cabeçalho fixo fora do menu */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: scrolled ? "35px" : "45px",
          backgroundColor: "#09427d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 15px",
          color: "white",
          fontWeight: "bold",
          fontSize: scrolled ? "14px" : "16px",
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
      >
        {/* Ícone para abrir o menu */}
        <img
          src="/logoDadg02.ico"
          alt="Logo DADG"
          style={{
            height: scrolled ? "20px" : "30px",
            cursor: "pointer",
          }}
          onClick={() => setMenuAberto(true)}
        />
        Diretório Acadêmico
      </header>

      {/* DrawerMenu com animação de slide e scroll */}
      <div
        className="drawerContainer" // Adicionada a classe
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "250px",
          height: "100vh",
          backgroundColor: "#1E3A8A",
          color: "white",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          zIndex: 1100,
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)",
          transform: menuAberto ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Botão de fechar */}
        <button
          onClick={() => setMenuAberto(false)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "20px",
            alignSelf: "flex-end",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        {/* Links principais */}
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
          🏠 Início
        </Link>
        <Link
          href="/certificados"
          style={{ color: "white", textDecoration: "none" }}
        >
          📃 Certificados
        </Link>
        <Link href="/eventos" style={{ color: "white", textDecoration: "none" }}>
          📅 Eventos
        </Link>
        <Link href="/contato" style={{ color: "white", textDecoration: "none" }}>
          📧 Contato
        </Link>
        <Link href="/sobre" style={{ color: "white", textDecoration: "none" }}>
          ℹ️ Sobre Nós
        </Link>

        {/* Submenu CLAM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/clam" style={{ color: "white", textDecoration: "none" }}>
              ⚕️ CLAM
            </Link>
            <button
              onClick={toggleClamSubmenu}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
              className="hover:text-gray-300"
            >
              {clamSubmenuOpen ? "−" : "+"}
            </button>
          </div>
          <div
            style={{
              marginLeft: "15px",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
              maxHeight: submenuMaxHeight,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {clamSubmenuItems.map((item) => (
                <Link
                  key={item}
                  href={`/clam/${item.toLowerCase()}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
