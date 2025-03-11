"use client";
import { useState } from "react";
import Link from "next/link";

export default function MenuDrawer() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      {/* Barra Superior */}
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
          justifyContent: "space-between",
          padding: "0 15px",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        {/* Ícone do menu (logo) */}
        <img 
          src="/logoDadg02.ico" 
          alt="Logo DADG" 
          style={{ height: "30px", cursor: "pointer" }} 
          onClick={() => setMenuAberto(true)}
        />
        Diretório Acadêmico
      </div>

      {/* Menu Lateral (Drawer) */}
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
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)"
          }}
        >
          {/* Botão de Fechar */}
          <button 
            onClick={() => setMenuAberto(false)} 
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px",
              alignSelf: "flex-end",
              cursor: "pointer"
            }}
          >
            ✖
          </button>

          {/* Links do Menu */}
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
        </div>
      )}
    </>
  );
}
