"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { ArrowLeft, CalendarDays, Loader2, LogIn, Users } from "lucide-react";
import {
  formatDate,
  processYear,
  STATUS_LABELS,
  type SelectionProcessDetail,
  type StudentApplicationState,
} from "../types";

export default function SelectionProcessPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const processId = params?.id ?? "";
  const { user, isLoading: isUserLoading } = useUser();

  const [process, setProcess] = useState<SelectionProcessDetail | null>(null);
  const [state, setState] = useState<StudentApplicationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!processId) return;

    setIsLoading(true);
    setError("");

    try {
      const detailResponse = await fetch(`/api/v1/selective-processes/${processId}`, { cache: "no-store" });
      const detailBody = await detailResponse.json().catch(() => ({}));
      if (!detailResponse.ok || !detailBody?.success) {
        throw new Error("Processo seletivo não encontrado.");
      }
      setProcess(detailBody.data as SelectionProcessDetail);

      if (!user) {
        setState(null);
        return;
      }

      const stateResponse = await fetch(`/api/v1/selective-processes/${processId}/me`, { cache: "no-store" });
      const stateBody = await stateResponse.json().catch(() => ({}));
      setState(stateResponse.ok && stateBody?.success ? (stateBody.data as StudentApplicationState) : null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro ao carregar o processo seletivo.");
    } finally {
      setIsLoading(false);
    }
  }, [processId, user]);

  useEffect(() => {
    if (!isUserLoading) void load();
  }, [isUserLoading, load]);

  // Regra pedida pela CLAM: ao abrir um processo seletivo o candidato vai direto
  // para o pagamento (se ainda não pagou) ou para o painel de ligas (se já pagou).
  useEffect(() => {
    if (!state) return;

    if (state.status === "PAID_PENDING_LEAGUES" || state.status === "ENROLLED") {
      router.replace(`/processos-seletivos/${processId}/painel`);
      return;
    }

    if (state.canCheckout) {
      router.replace(`/processos-seletivos/${processId}/inscricao`);
    }
  }, [state, processId, router]);

  if (isUserLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-label="Carregando processo seletivo" />
      </main>
    );
  }

  if (error || !process) {
    return (
      <main className="page-shell min-h-screen space-y-6 pb-16 pt-28">
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error || "Processo seletivo não encontrado."}
        </p>
        <Link href="/processos-seletivos" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <ArrowLeft className="h-4 w-4" /> Voltar para a listagem
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen space-y-8 pb-16 pt-28">
      <Link href="/processos-seletivos" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        <ArrowLeft className="h-4 w-4" /> Todos os processos seletivos
      </Link>

      <header className="glass-panel-strong space-y-4 rounded-3xl border border-white/80 p-6 dark:border-white/10 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">CLAM</p>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
          Processo seletivo {processYear(process.registrationStartDate)}
        </h1>

        <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <li className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
            Inscrições de {formatDate(process.registrationStartDate)} a {formatDate(process.registrationEndDate)}
          </li>
          <li className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
            {process.remainingCapacity} vaga{process.remainingCapacity === 1 ? "" : "s"} restante
            {process.remainingCapacity === 1 ? "" : "s"} de {process.maxCapacity}
          </li>
        </ul>

        {state && (
          <p className="w-max rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
            {STATUS_LABELS[state.status]}
          </p>
        )}
      </header>

      {!user && (
        <section className="glass-panel surface-outline flex flex-col gap-4 rounded-[28px] border border-white/70 p-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Entre para se inscrever</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Sua inscrição fica vinculada à sua conta do DADG.
            </p>
          </div>
          <a
            href={`/auth/login?returnTo=${encodeURIComponent(`/processos-seletivos/${processId}`)}`}
            className="inline-flex w-max items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <LogIn className="h-4 w-4" /> Fazer login
          </a>
        </section>
      )}

      {user && state && !state.canCheckout && !state.canSelectLeagues && state.status !== "ENROLLED" && (
        <section className="glass-panel surface-outline rounded-[28px] border border-white/70 p-6 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{STATUS_LABELS[state.status]}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {state.status === "REGISTRATION_NOT_OPEN"
              ? `As inscrições abrem em ${formatDate(process.registrationStartDate)}.`
              : state.status === "SOLD_OUT"
                ? "Todas as vagas deste processo seletivo já foram preenchidas."
                : "O período de inscrições deste processo seletivo já foi encerrado."}
          </p>
        </section>
      )}

      <section className="glass-panel surface-outline rounded-[28px] border border-white/70 p-6 dark:border-white/10">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Ligas participantes</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          As ligas são escolhidas depois da confirmação do pagamento.
        </p>

        {process.exams.length === 0 ? (
          <p className="mt-4 rounded-[22px] border border-dashed border-[rgba(9,66,125,0.18)] px-4 py-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            Nenhuma liga cadastrada neste processo seletivo até o momento.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {process.exams.map((exam) => (
              <li
                key={exam.id}
                className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-slate-900/72"
              >
                <p className="font-semibold text-slate-900 dark:text-white">{exam.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Prova em {formatDate(exam.examStartDate)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
