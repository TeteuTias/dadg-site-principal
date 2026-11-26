"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, ClipboardList, FileText, Grid } from "lucide-react";
import { useUserContext } from "@/lib/userProvider";

// QR ilustrativo (não é lido por câmera): grade 25x25 fixa, com os 3 cantos de leitura arredondados e o símbolo do DADG no meio.
const N = 25;
const MODULOS = (() => {
  let s = 1897;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  const canto = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  const meio = (x: number, y: number) => x >= 9 && x <= 15 && y >= 9 && y <= 15;
  const l: [number, number][] = [];
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) if (!canto(x, y) && !meio(x, y) && rnd() > 0.52) l.push([x, y]);
  return l;
})();

function CantoQr({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.9} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} fill="currentColor" />
    </g>
  );
}

function QrIlustrado({ className = "", animar = true }: { className?: string; animar?: boolean }) {
  const reduzir = useReducedMotion();
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="relative rounded-[22px] border border-white/15 bg-white/[0.06] p-3 shadow-[0_18px_40px_rgba(0,10,30,0.35)] backdrop-blur-sm">
        {/* cantos de mira */}
        <span className="absolute -left-1.5 -top-1.5 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-blue-300/80" />
        <span className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-blue-300/80" />
        <span className="absolute -bottom-1.5 -left-1.5 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-blue-300/80" />
        <span className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-blue-300/80" />
        <div className="relative overflow-hidden rounded-[14px] bg-white p-2.5">
          <svg viewBox={`0 0 ${N} ${N}`} className="block h-full w-full text-[#062a52]" shapeRendering="geometricPrecision">
            {MODULOS.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x + 0.07} y={y + 0.07} width={0.86} height={0.86} rx={0.32} fill="currentColor" />
            ))}
            <CantoQr x={0} y={0} />
            <CantoQr x={N - 7} y={0} />
            <CantoQr x={0} y={N - 7} />
          </svg>
          <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#062a52] p-1 ring-4 ring-white">
            <img src="/dadg_sem_fundo.png" alt="" className="h-full w-full object-contain" loading="lazy" />
          </div>
          {animar && !reduzir && (
            <motion.div
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-blue-400/25 to-transparent"
              initial={{ top: "-20%" }}
              animate={{ top: ["-20%", "100%"] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const glass =
  "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md " +
  "shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500";

const services = [
  { href: "/certificados", label: "Certificados", desc: "Busque e baixe seus certificados.", icon: FileText },
  { href: "/eventos", label: "Eventos", desc: "Programação e inscrições abertas.", icon: CalendarDays },
  { href: "/processos-seletivos", label: "Processos seletivos", desc: "Editais das ligas acadêmicas.", icon: ClipboardList },
  { href: "/coordenadorias", label: "Coordenadorias", desc: "Conheça os núcleos do DADG.", icon: Grid },
];

export default function QuickAccess() {
  const { isAuthenticated, displayName, status } = useUserContext();
  const firstName = status === "ready" ? displayName.split(" ")[0] : "";

  return (
    <motion.nav
      aria-label="Acesso rápido"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
      className="mb-24 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
    >
      <motion.div variants={item} className={`${glass} col-span-2 flex flex-col p-8 sm:p-10 md:row-span-2`}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-400 opacity-10 blur-[70px]" />
        <QrIlustrado animar={false} className="absolute -bottom-10 -right-10 w-44 rotate-[-8deg] opacity-[0.09] xl:hidden" />
        <QrIlustrado className="absolute bottom-9 right-9 hidden w-36 rotate-[4deg] xl:block" />

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Área do aluno</p>
        <h3 className="mb-4 font-serif text-3xl font-bold text-white sm:text-4xl">
          {isAuthenticated ? (firstName ? `Olá, ${firstName}` : "Sua área do aluno") : "Sua conta DADG"}
        </h3>
        <p className="max-w-md flex-grow leading-relaxed text-blue-100/70">
          {isAuthenticated
            ? "Seu QR Code de presença, suas inscrições e seus certificados em um só lugar."
            : "Entre para se inscrever em eventos, usar seu QR Code de presença e reunir seus certificados."}
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Link href="/perfil" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#002B5B] transition-colors hover:bg-blue-50">
              Abrir minha conta <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <a href="/api/auth/login?returnTo=%2Fperfil" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#002B5B] transition-colors hover:bg-blue-50">
                Entrar <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/criar-conta" className="inline-flex items-center rounded-xl border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {services.map(({ href, label, desc, icon: Icon }) => (
        <motion.div key={href} variants={item}>
          <Link
            href={href}
            className={`${glass} flex h-full flex-col p-5 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08] sm:p-6`}
          >
            <div className="mb-4 w-fit rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-1 font-serif text-lg font-bold text-white">{label}</h3>
            <p className="hidden flex-grow text-sm leading-relaxed text-blue-100/70 sm:block">{desc}</p>
            <ArrowRight aria-hidden="true" className="mt-4 h-4 w-4 text-blue-200 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
