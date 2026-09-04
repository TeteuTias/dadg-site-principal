"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, GraduationCap, Loader2, RefreshCw, Search, Users } from "lucide-react";
import { formatDate, processYear, type SelectionProcessSummary } from "./types";

function statusBadge(process: SelectionProcessSummary) {
  if (!process.hasStarted) {
    return { label: "Em breve", className: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300" };
  }
  if (process.hasEnded) {
    return { label: "Encerrado", className: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" };
  }
  if (process.remainingCapacity <= 0) {
    return { label: "Vagas esgotadas", className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300" };
  }
  return { label: "Inscrições abertas", className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300" };
}

export default function SelectionProcessesPage() {
  const [processes, setProcesses] = useState<SelectionProcessSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);

  const loadProcesses = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/selective-processes", { cache: "no-store" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.success) {
        throw new Error("Não foi possível carregar os processos seletivos.");
      }
      setProcesses(Array.isArray(body.data) ? body.data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro ao carregar os processos seletivos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProcesses();
  }, [loadProcesses]);

  const visibleProcesses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return processes.filter((process) => {
      if (onlyOpen && !process.isRegistrationOpen) return false;
      if (!term) return true;

      const haystack = [
        formatDate(process.registrationStartDate),
        formatDate(process.registrationEndDate),
        processYear(process.registrationStartDate).toString(),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [processes, search, onlyOpen]);

  return (
    <main className="page-shell min-h-screen space-y-8 pb-16 pt-28">
      <header className="glass-panel-strong rounded-3xl border border-white/80 p-6 dark:border-white/10 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">CLAM</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
          Processos seletivos das ligas acadêmicas
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Consulte os processos seletivos abertos pela Coordenadoria de Ligas Acadêmicas de Medicina, faça a
          inscrição e escolha as ligas em que quer concorrer.
        </p>
      </header>

      <section className="glass-panel surface-outline flex flex-col gap-4 rounded-[28px] border border-white/70 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por período ou ano"
            className="w-full rounded-2xl border border-white/70 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={(event) => setOnlyOpen(event.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Só inscrições abertas
          </label>

          <button
            type="button"
            onClick={() => void loadProcesses()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
          >
            <RefreshCw className="h-4 w-4" /> Atualizar
          </button>
        </div>
      </section>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-label="Carregando processos seletivos" />
        </div>
      ) : visibleProcesses.length === 0 ? (
        <p className="rounded-[28px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white/72 px-6 py-12 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
          {processes.length === 0
            ? "Nenhum processo seletivo cadastrado no momento."
            : "Nenhum processo seletivo corresponde ao filtro aplicado."}
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {visibleProcesses.map((process) => {
            const badge = statusBadge(process);

            return (
              <article
                key={process.id}
                className="glass-panel surface-outline flex flex-col justify-between gap-5 rounded-[28px] border border-white/70 p-6 dark:border-white/10"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      {process.examsCount} liga{process.examsCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                    Processo seletivo {processYear(process.registrationStartDate)}
                  </h2>

                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                      Inscrições de {formatDate(process.registrationStartDate)} a {formatDate(process.registrationEndDate)}
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                      {process.paidCount} de {process.maxCapacity} vagas preenchidas
                    </li>
                    <li className="flex items-start gap-2">
                      <GraduationCap className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                      Até {process.maxExamsPerApplication} liga{process.maxExamsPerApplication === 1 ? "" : "s"} por inscrição
                    </li>
                  </ul>
                </div>

                <Link
                  href={`/processos-seletivos/${process.id}`}
                  className="inline-flex w-max items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Ver processo seletivo
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
