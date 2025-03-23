// app/coordenadorias/page.tsx
import React from "react";
import Link from "next/link";
import Card from "../components/card";
import styles from "../styles/styles.module.scss";

export default function CoordenadoriasPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}></h1>
        <div className={styles.waveContainer}>
          <svg viewBox="0 0 1440 320">
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,256L60,245.3C120,235,240,213,360,186.7C480,160,600,128,720,149.3C840,171,960,245,1080,245.3C1200,245,1320,171,1380,133.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      <div className={styles.container}>
        <Link href="/coordenadorias/caep">
    
            <Card
              dataImage="/CAEP.png"
              header="CAEP"
              content="Descrição para CAEP."
            />
          
        </Link>
        <Link href="/coordenadorias/caes">
          
            <Card
              dataImage="/CAES.jpg"
              header="CAES"
              content="Descrição para CAES."
            />
          
        </Link>
        <Link href="/coordenadorias/clam">
          
            <Card
              dataImage="/CLAM.png"
              header="CLAM"
              content="Descrição para CLAM."
            />
          
        </Link>
        <Link href="/coordenadorias/cac">
          
            <Card
              dataImage="/CAC.jpeg"
              header="CAC"
              content="Coordenadoria de Certificados e TI."
            />
          
        </Link>
      </div>
    </div>
  );
}
