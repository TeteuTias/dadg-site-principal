"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import QuickAccess from "./QuickAccess";

type Stats = {
  certificadosEmitidos: number;
  eventosRealizados: number;
  coordenadoriasAtivas: number;
};

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1], // expo out — fast start, satisfying settle
      onUpdate(latest) {
        if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString("pt-BR");
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} aria-label={value.toLocaleString("pt-BR")}>
      0
    </span>
  );
}

export default function ImpactStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/get/homeStats", { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const value = await r.json();
        if (
          ![value.certificadosEmitidos, value.eventosRealizados, value.coordenadoriasAtivas].every(
            (n) => Number.isSafeInteger(n) && n >= 0,
          )
        )
          throw new Error();
        setStats(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const items = stats
    ? [
        { value: stats.certificadosEmitidos, label: "Certificados liberados", description: "Reconhecimentos entregues à nossa comunidade" },
        { value: stats.eventosRealizados, label: "Eventos publicados", description: "Simpósios, workshops e congressos organizados" },
        { value: stats.coordenadoriasAtivas, label: "Ligas cadastradas", description: "Grupos focados em ensino, pesquisa e extensão" },
      ]
    : [];

  return (
    <section
      aria-label="Acesso rápido e números do DADG"
      className="relative z-10 w-full bg-[#002B5B] py-24 px-6 overflow-hidden"
    >
      {/* Subtle radial glow background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <QuickAccess />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Nosso Impacto
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif">
            Números que falam por nós
          </h2>
        </motion.div>

        {stats ? (
          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-4"
          >
            {items.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                }}
                className="flex flex-col items-center text-center px-2"
              >
                <dt className="order-2 text-blue-200/80 text-sm md:text-base leading-snug mt-4 font-medium">
                  {stat.label}
                </dt>
                <dd className="order-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tabular-nums leading-none drop-shadow-lg">
                  <AnimatedCounter value={stat.value} />
                </dd>
                <p className="order-3 text-blue-300/60 text-xs leading-relaxed mt-2 hidden md:block">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </motion.dl>
        ) : (
          <p role="status" className="text-center text-blue-200/80">
            {failed ? "Estatísticas temporariamente indisponíveis." : "Carregando estatísticas…"}
          </p>
        )}
      </div>
    </section>
  );
}
