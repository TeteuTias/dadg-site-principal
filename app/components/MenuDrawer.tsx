'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MenuDrawer() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coordenadoriasSubmenuOpen, setCoordenadoriasSubmenuOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("250px");
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const pathname = usePathname();

  // Mantém o efeito "verde" para CLAM
  const headerBackgroundColor =
    pathname.startsWith("/coordenadorias/clam")
      ? "#0A7A1A" // verde
      : pathname.startsWith("/coordenadorias/caes")
      ? "#056653"
      : "#09427d";
  const drawerBackgroundColor = headerBackgroundColor;

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
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setDrawerWidth("80%");
      } else {
        setDrawerWidth("250px");
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCoordenadoriasSubmenu = () =>
    setCoordenadoriasSubmenuOpen((prev) => !prev);

  // Submenu para coordenadorias com as rotas atualizadas
  const coordenadoriasSubmenuItems = [
    { label: "CAEP", href: "/coordenadorias/embreve" },
    { label: "CAES", href: "/coordenadorias/embreve" },
    { label: "CLAM", href: "/coordenadorias/embreve" },
    { label: "CLEV", href: "/coordenadorias/embreve" },
  ];

  const coordenadoriasSubmenuMaxHeight = coordenadoriasSubmenuOpen
    ? `${coordenadoriasSubmenuItems.length * 30}px`
    : "0px";

  // Define o tamanho da fonte do header de forma responsiva
  const headerFontSize = scrolled
    ? windowWidth < 768
      ? "12px"
      : "14px"
    : windowWidth < 768
    ? "14px"
    : "16px";

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
          fontSize: headerFontSize,
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
      >
        {/* Botão Hamburger */}
        <div style={{ display: "flex", alignItems: "center" }}>
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
            <span
              style={{
                width: "24px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "4px",
                display: "block",
              }}
            ></span>
            <span
              style={{
                width: "24px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "4px",
                display: "block",
              }}
            ></span>
            <span
              style={{
                width: "24px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "4px",
                display: "block",
              }}
            ></span>
          </button>
        </div>

        {/* Links centrais */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            textTransform: "uppercase",
          }}
        >
          <Link href="/certificados" style={{ color: "white", textDecoration: "none" }}>
            Certificados
          </Link>
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            Início
          </Link>
          <Link href="/coordenadorias" style={{ color: "white", textDecoration: "none" }}>
          Coordenadorias
          </Link>
        </div>

        {/* Ícone à direita */}
        <div style={{ flexShrink: 0 }}>
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
        className="drawerContainer"
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
        {/* Botão de fechar com o X estilizado */}
        <div
          className="container zoom_invert"
          onClick={() => setMenuAberto(false)}
          style={{ cursor: "pointer", alignSelf: "flex-end" }}
        >
          <div className="close_icon zoom_invert"></div>
        </div>

        {/* Links do Drawer */}
        <Link href="/" style={{ color: "white", textDecoration: "none" }} onClick={() => setMenuAberto(false)}>
          🏠 Início
        </Link>
        <Link href="/certificados" style={{ color: "white", textDecoration: "none" }} onClick={() => setMenuAberto(false)}>
          📃 Certificados
        </Link>
        <Link href="/mural" style={{ color: "white", textDecoration: "none" }} onClick={() => setMenuAberto(false)}> 
          📬 Mural
        </Link>
        <Link href="/eventos" style={{ color: "white", textDecoration: "none" }} onClick={() => setMenuAberto(false)}> 
          📅 Eventos
        </Link>
        <Link href="/contato" style={{ color: "white", textDecoration: "none" }}onClick={() => setMenuAberto(false)}> 
          📧 Contato
        </Link>
        <Link href="/sobre" style={{ color: "white", textDecoration: "none" }}onClick={() => setMenuAberto(false)}> 
          ℹ️ Sobre Nós
        </Link>

        {/* Submenu para Coordenadorias */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/coordenadorias" style={{ color: "white", textDecoration: "none" }} onClick={() => setMenuAberto(false)}> 
            ⚕️Coordenadorias
            </Link>
            <button
              onClick={toggleCoordenadoriasSubmenu}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {coordenadoriasSubmenuOpen ? "−" : "+"}
            </button>
          </div>
          <div
            style={{
              marginLeft: "15px",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
              maxHeight: coordenadoriasSubmenuMaxHeight,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {coordenadoriasSubmenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    // Exemplo: se o pathname corresponder ao item, pode-se aplicar um estilo de destaque
                    fontWeight: pathname === item.href ? "normal" : "normal",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
