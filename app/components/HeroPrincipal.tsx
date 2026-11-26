"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

// Hero da home (proposta Izi, 26/11/2026): foto do prédio histórico do IMEPAC ao fundo, azul-marinho do DADG
// com o dourado da marca, título centralizado e os dois caminhos mais usados (eventos e certificados).
// O fundo termina em #041a31: é a cor que o WaveDivider logo abaixo usa como "bg".
export const HERO_FUNDO = "#041a31";

const subir = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HeroPrincipal() {
  const reduzir = useReducedMotion();

  return (
    <section
      aria-label="Seção principal do Diretório Acadêmico Diogo Guimarães"
      className="relative isolate flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 pb-28 pt-32 text-center md:pb-24"
      style={{ background: HERO_FUNDO }}
    >
      {/* foto */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        initial={reduzir ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/imepac-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%]"
        />
      </motion.div>

      {/* camadas de cor: azul-marinho por cima da foto, mais fechado nas bordas e embaixo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(4,26,49,0.55) 0%, rgba(4,26,49,0.82) 60%, rgba(4,26,49,0.94) 100%)",
            `linear-gradient(to bottom, rgba(4,26,49,0.85) 0%, rgba(4,26,49,0.2) 30%, rgba(4,26,49,0.35) 60%, ${HERO_FUNDO} 100%)`,
          ].join(","),
        }}
      />
      {/* grade fina (a mesma assinatura da hero antiga), só no meio */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_30%,transparent_100%)]"
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
      >
        <motion.p
          variants={subir}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/85 backdrop-blur-sm sm:text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-400)]" aria-hidden="true" />
          Medicina · IMEPAC Araguari
        </motion.p>

        <motion.h1
          variants={subir}
          className="font-serif text-[2.4rem] font-bold leading-[1.04] tracking-tight text-white [text-wrap:balance] sm:text-6xl md:text-7xl lg:text-[5.4rem]"
        >
          Diretório Acadêmico
          <span className="mt-1 block text-[var(--gold-400)]">Diogo Guimarães</span>
        </motion.h1>

        <motion.span
          variants={subir}
          aria-hidden="true"
          className="mt-8 block h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent"
        />

        <motion.p
          variants={subir}
          className="mt-6 max-w-xl text-base font-light leading-relaxed text-blue-100/80 [text-wrap:pretty] sm:text-lg md:text-xl"
        >
          Conectando estudantes de medicina, promovendo a excelência acadêmica e forjando os líderes da saúde do amanhã.
        </motion.p>

        <motion.div variants={subir} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/eventos"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#041a31] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-colors hover:bg-blue-50 sm:w-auto"
          >
            Ver eventos
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/certificados"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/[0.12] sm:w-auto"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Buscar certificado
          </Link>
        </motion.div>
      </motion.div>

      {/* indicador de rolagem */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-100/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        Conheça
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          {!reduzir && (
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-[var(--gold-400)]"
              animate={{ y: ["-100%", "250%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
      </motion.div>
    </section>
  );
}
