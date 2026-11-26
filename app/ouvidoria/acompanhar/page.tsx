"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";
import { normalizarProtocolo, STATUS, type Status } from "@/lib/ouvidoria-opcoes";
import { cn } from "@/lib/utils";

type Dados = {
  protocolo: string;
  tipo: string;
  categoria: string;
  status: Status;
  criadaEm: string;
  atualizadaEm: string;
  historico: { status: Status; em: string }[];
  resposta: { texto: string; em: string } | null;
};

const data = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export default function AcompanharPage() {
  const [protocolo, setProtocolo] = useState("");
  const [estado, setEstado] = useState<"livre" | "buscando" | "erro">("livre");
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState<Dados | null>(null);
  const resultado = useRef<HTMLDivElement>(null);

  async function consultar(valor: string) {
    const p = normalizarProtocolo(valor);
    if (!p) {
      setEstado("erro");
      setErro("Protocolo inválido. Ele tem o formato OUV-2026-XXXX-XXXX.");
      return;
    }
    setProtocolo(p);
    setEstado("buscando");
    setErro("");
    try {
      const r = await fetch("/api/ouvidoria/acompanhar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolo: p }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) {
        setDados(null);
        setEstado("erro");
        setErro(d?.error ?? "Não foi possível consultar agora.");
        return;
      }
      setDados(d.dados);
      setEstado("livre");
      requestAnimationFrame(() => resultado.current?.focus());
    } catch {
      setEstado("erro");
      setErro("Sem conexão com o servidor. Tente de novo.");
    }
  }

  // Vindo da tela de envio: o protocolo chega no # (não vai para o servidor nem para o log).
  useEffect(() => {
    let doLink = "";
    try {
      doLink = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      /* # malformado: ignora */
    }
    if (doLink) {
      history.replaceState(null, "", window.location.pathname);
      void consultar(doLink);
    }
  }, []);

  function enviar(e: FormEvent) {
    e.preventDefault();
    void consultar(protocolo);
  }

  const etapaAtual = dados ? STATUS.findIndex((s) => s.value === dados.status) : -1;

  return (
    <div className="space-y-10 pt-28 pb-8 sm:space-y-12">
      <PageHero
        eyebrow="Ouvidoria"
        title="Acompanhar manifestação"
        description="Digite o protocolo que você recebeu ao enviar. Por segurança, aqui aparecem só o andamento e a resposta do DADG, não o texto que você escreveu."
      />

      <section className="page-shell">
        <div className="mx-auto max-w-2xl space-y-6">
          <form onSubmit={enviar} className="glass-panel surface-outline rounded-[28px] border border-white/70 p-5 sm:p-7 dark:border-white/10">
            <label htmlFor="ouv-protocolo" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Número do protocolo
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="ouv-protocolo"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
                placeholder="OUV-2026-XXXX-XXXX"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="h-12 w-full min-w-0 rounded-[18px] border border-[rgba(9,66,125,0.16)] bg-white px-4 font-mono text-[15px] tracking-wider text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.1)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={estado === "buscando"}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-[var(--brand-900)] disabled:opacity-60"
              >
                <Search className="h-4 w-4" aria-hidden />
                {estado === "buscando" ? "Consultando..." : "Consultar"}
              </button>
            </div>
            {estado === "erro" ? (
              <p role="alert" className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                {erro}
              </p>
            ) : null}
          </form>

          {dados ? (
            <div
              ref={resultado}
              tabIndex={-1}
              aria-live="polite"
              className="glass-panel surface-outline space-y-7 rounded-[28px] border border-white/70 p-5 outline-none sm:p-7 dark:border-white/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-semibold tracking-wider text-[var(--brand-900)] dark:text-white">{dados.protocolo}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {dados.tipo} · {dados.categoria} · enviada em {data(dados.criadaEm)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    dados.status === "respondida" || dados.status === "encerrada"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200"
                      : "bg-[var(--brand-50)] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-200",
                  )}
                >
                  {STATUS[etapaAtual]?.label ?? dados.status}
                </span>
              </div>

              <ol className="space-y-0" aria-label="Andamento">
                {STATUS.map((s, i) => {
                  const feito = i <= etapaAtual;
                  const quando = [...dados.historico].reverse().find((h) => h.status === s.value)?.em;
                  return (
                    <li key={s.value} className="relative flex gap-4 pb-5 last:pb-0">
                      {i < STATUS.length - 1 ? (
                        <span
                          aria-hidden
                          className={cn("absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5", i < etapaAtual ? "bg-[var(--brand-700)]" : "bg-slate-200 dark:bg-white/10")}
                        />
                      ) : null}
                      <span
                        aria-hidden
                        className={cn(
                          "relative z-10 mt-0.5 h-6 w-6 shrink-0 rounded-full border-2",
                          feito ? "border-[var(--brand-700)] bg-[var(--brand-700)]" : "border-slate-300 bg-white dark:border-white/20 dark:bg-slate-900",
                        )}
                      />
                      <div>
                        <p className={cn("text-[15px] font-semibold", feito ? "text-slate-950 dark:text-white" : "text-slate-400")}>
                          {s.label}
                          <span className="sr-only">{feito ? " (concluída)" : " (pendente)"}</span>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{quando ? data(quando) : feito ? "Etapa concluída" : s.hint}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="rounded-[20px] border border-[rgba(9,66,125,0.12)] bg-white px-5 py-4 dark:border-white/10 dark:bg-slate-900/80">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Resposta do DADG</p>
                {dados.resposta ? (
                  <>
                    <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-slate-700 dark:text-slate-200">{dados.resposta.texto}</p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Publicada em {data(dados.resposta.em)}</p>
                  </>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Ainda sem resposta. Volte aqui mais tarde com o mesmo protocolo.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Perdeu o protocolo? Envie uma nova manifestação e mencione o assunto anterior.{" "}
            <Link href="/ouvidoria" className="inline-flex items-center gap-1 font-semibold text-[var(--brand-800)] hover:underline dark:text-blue-300">
              Ir para a ouvidoria <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
