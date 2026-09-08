"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { ArrowLeft, CheckCircle2, Loader2, Lock, LogIn, RefreshCw } from "lucide-react";
import {
  describeError,
  formatCurrency,
  formatDate,
  processYear,
  STATUS_LABELS,
  type StudentApplicationState,
} from "../../types";

export default function SelectionProcessDashboardPage() {
  const params = useParams<{ id: string }>();
  const processId = params?.id ?? "";
  const { user, isLoading: isUserLoading } = useUser();

  const [state, setState] = useState<StudentApplicationState | null>(null);
  const [chosenExamIds, setChosenExamIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    if (!processId || !user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/v1/selective-processes/${processId}/me`, { cache: "no-store" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.success) {
        throw new Error(describeError(body?.error, "Não foi possível carregar sua inscrição."));
      }
      setState(body.data as StudentApplicationState);
      setChosenExamIds([]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro ao carregar sua inscrição.");
    } finally {
      setIsLoading(false);
    }
  }, [processId, user]);

  useEffect(() => {
    if (!isUserLoading) void load();
  }, [isUserLoading, load]);

  const toggleExam = (examId: string) => {
    setChosenExamIds((previous) => {
      if (previous.includes(examId)) return previous.filter((id) => id !== examId);
      if (state && previous.length >= state.remainingSelections) return previous;
      return [...previous, examId];
    });
  };

  const confirmSelection = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/v1/selective-processes/${processId}/leagues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examIds: chosenExamIds }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok || !body?.success) {
        throw new Error(describeError(body?.error, "Não foi possível registrar suas ligas."));
      }

      setState(body.data as StudentApplicationState);
      setChosenExamIds([]);
      setSuccess("Ligas registradas com sucesso.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro ao registrar suas ligas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-label="Carregando painel" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-shell flex min-h-screen flex-col items-center justify-center gap-5 text-center">
        <LogIn className="h-12 w-12 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Entre para ver sua inscrição</h1>
        <a
          href={`/auth/login?returnTo=${encodeURIComponent(`/processos-seletivos/${processId}/painel`)}`}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Fazer login
        </a>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="page-shell min-h-screen space-y-6 pb-16 pt-28">
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error || "Não foi possível carregar sua inscrição."}
        </p>
        <Link href="/processos-seletivos" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <ArrowLeft className="h-4 w-4" /> Voltar para a listagem
        </Link>
      </main>
    );
  }

  const isPaid = state.ticket?.paymentStatus === "PAID";
  const selectedSet = new Set(state.selectedExamIds);

  return (
    <main className="page-shell min-h-screen space-y-8 pb-16 pt-28">
      <Link
        href={`/processos-seletivos/${processId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao processo seletivo
      </Link>

      <header className="glass-panel-strong flex flex-col gap-5 rounded-3xl border border-white/80 p-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Minha inscrição</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Processo seletivo {processYear(state.process.registrationStartDate)}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{STATUS_LABELS[state.status]}</p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex w-max items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
        >
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </header>

      {state.ticket && (
        <section className="glass-panel surface-outline grid gap-4 rounded-[28px] border border-white/70 p-6 dark:border-white/10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Pagamento</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {isPaid ? "Confirmado" : state.ticket.paymentStatus === "CANCELED" ? "Revertido" : state.ticket.paymentStatus === "REVIEW_REQUIRED" ? "Em revisão" : "Pendente"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Valor</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(state.ticket.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Ligas contratadas</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {state.selectedExamIds.length} de {state.ticket.leagueAllowanceCount}
            </p>
          </div>
        </section>
      )}

      {!isPaid && (
        <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">{STATUS_LABELS[state.status]}</h2>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            {state.status === "PAYMENT_REVIEW_REQUIRED" || state.status === "PAYMENT_REVERSED" ? "A escolha de ligas está bloqueada. Procure a equipe para verificar sua inscrição." : "A escolha das ligas é liberada assim que o Mercado Pago confirmar o pagamento. A confirmação pode levar alguns minutos."}
          </p>
          <Link
            href={`/processos-seletivos/${processId}/inscricao`}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Ver pagamento
          </Link>
        </section>
      )}

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {success}
        </p>
      )}

      <section className="glass-panel surface-outline rounded-[28px] border border-white/70 p-6 dark:border-white/10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Ligas acadêmicas disponíveis</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {isPaid
                ? state.remainingSelections > 0
                  ? `Escolha ${state.remainingSelections} liga${state.remainingSelections === 1 ? "" : "s"}. A escolha é definitiva.`
                  : "Você já registrou todas as ligas da sua inscrição."
                : "Disponível após a confirmação do pagamento."}
            </p>
          </div>

          {isPaid && state.remainingSelections > 0 && (
            <button
              type="button"
              onClick={() => void confirmSelection()}
              disabled={isSubmitting || chosenExamIds.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Confirmar {chosenExamIds.length || ""} liga{chosenExamIds.length === 1 ? "" : "s"}
            </button>
          )}
        </div>

        {state.process.exams.length === 0 ? (
          <p className="mt-5 rounded-[22px] border border-dashed border-[rgba(9,66,125,0.18)] px-4 py-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Nenhuma liga cadastrada neste processo seletivo até o momento.
          </p>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {state.process.exams.map((exam) => {
              const alreadySelected = selectedSet.has(exam.id);
              const isChosen = chosenExamIds.includes(exam.id);
              const canToggle = isPaid && !alreadySelected && state.remainingSelections > 0;

              return (
                <li key={exam.id}>
                  <button
                    type="button"
                    onClick={() => canToggle && toggleExam(exam.id)}
                    disabled={!canToggle}
                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition-transform duration-300 ${
                      alreadySelected
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                        : isChosen
                          ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
                          : "border-white/70 bg-white/80 dark:border-white/10 dark:bg-slate-900/72"
                    } ${canToggle ? "hover:-translate-y-0.5" : "cursor-default opacity-90"}`}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block font-semibold text-slate-900 dark:text-white">{exam.name}</span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                          Prova em {formatDate(exam.examStartDate)}
                        </span>
                      </span>

                      {alreadySelected ? (
                        <span className="inline-flex flex-none items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                          <Lock className="h-3 w-3" /> Confirmada
                        </span>
                      ) : isChosen ? (
                        <CheckCircle2 className="h-5 w-5 flex-none text-blue-600" />
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
