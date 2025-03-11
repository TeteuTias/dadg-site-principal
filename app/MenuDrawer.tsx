"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MenuDrawer() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Atualiza o estado 'scrolled' conforme a rolagem
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Cabeçalho que encolhe ao rolar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: scrolled ? "25px" : "40px",
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
        {/* Ícone que abre o DrawerMenu */}
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

      {/* DrawerMenu: aparece quando 'menuAberto' for true */}
      {menuAberto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "250px",
            height: "100vh",
            backgroundColor: "#1E3A8A",
            color: "white",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            zIndex: 1100,
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)",
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

          {/* Links do Menu */}
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
          <Link href="/clam" style={{ color: "white", textDecoration: "none" }}>
            ⚕️ CLAM
          </Link>
        </div>
      )}
    </>
  );
}
