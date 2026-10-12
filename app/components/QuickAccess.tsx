"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ClipboardList, FileText, Grid, QrCode } from "lucide-react";
import { useUserContext } from "@/lib/userProvider";

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
        <QrCode aria-hidden="true" strokeWidth={1} className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-white opacity-[0.05]" />

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
