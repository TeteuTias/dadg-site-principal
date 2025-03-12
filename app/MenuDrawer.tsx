"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MenuDrawer() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clamSubmenuOpen, setClamSubmenuOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("250px");
  const pathname = usePathname();

  // Define cores dinâmicas para o header e o drawer
  const headerBackgroundColor = pathname.startsWith("/clam") ? "#16a34a" : "#09427d";
  const drawerBackgroundColor = pathname.startsWith("/clam") ? "#16a34a" : "#1E3A8A";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Atualiza a largura do drawer conforme o tamanho da tela
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) { // telas menores que 768px
        setDrawerWidth("80%");
      } else {
        setDrawerWidth("250px");
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    "LAE",
  ];

  const submenuMaxHeight = clamSubmenuOpen ? `${clamSubmenuItems.length * 30}px` : "0px";

  return (
    <>
      {/* Cabeçalho fixo */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: scrolled ? "35px" : "45px",
          backgroundColor: headerBackgroundColor,
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
        {/* Botão Hamburger */}
        <div className="flex items-center">
          <button
            onClick={() => setMenuAberto(true)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{ width: "24px", height: "4px", backgroundColor: "white", borderRadius: "4px", display: "block" }}></span>
            <span style={{ width: "24px", height: "4px", backgroundColor: "white", borderRadius: "4px", display: "block" }}></span>
            <span style={{ width: "24px", height: "4px", backgroundColor: "white", borderRadius: "4px", display: "block" }}></span>
          </button>
        </div>

        {/* Links centrais visíveis em todas as telas */}
        <div className="flex items-center justify-center space-x-4" style={{ textTransform: "uppercase" }}>
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            Início
          </Link>
          <Link href="/certificados" style={{ color: "white", textDecoration: "none" }}>
            Certificados
          </Link>
          <Link href="/clam" style={{ color: "white", textDecoration: "none" }}>
            CLAM
          </Link>
        </div>

        {/* Ícone à direita */}
        <div className="flex-shrink-0">
          <Image
            src="/dadg_sem_fundo.png"
            alt="Logo DADG"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
      </header>

      {/* DrawerMenu */}
      <div
        className={`drawerContainer ${pathname.startsWith("/clam") ? "clam-scroll" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: drawerWidth,
          height: "100vh",
          backgroundColor: drawerBackgroundColor,
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

        {/* Links do Drawer */}
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
          🏠 Início
        </Link>
        <Link href="/certificados" style={{ color: "white", textDecoration: "none" }}>
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

        {/* Submenu para CLAM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/clam" style={{ color: "white", textDecoration: "none" }}>
              ⚕️ CLAM
            </Link>
            <button
              onClick={toggleClamSubmenu}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px" }}
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
                <Link key={item} href={`/clam/${item.toLowerCase()}`} style={{ color: "white", textDecoration: "none" }}>
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
