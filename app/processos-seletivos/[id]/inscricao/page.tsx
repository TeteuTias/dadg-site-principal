"use client";

import Link from "next/link";
import ProfileGate from '../../ProfileGate';
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { ArrowLeft, CreditCard, Loader2, LogIn, ShieldCheck } from "lucide-react";
import {
  STATUS_LABELS,
  describeError,
  formatCurrency,
  formatDateTime,
  type StudentApplicationState,
} from "../../types";

type PayerForm = {
  name: string;
  cpf: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  phone: string;
  email: string;
};

const EMPTY_PAYER: PayerForm = {
  name: "",
  cpf: "",
  zipCode: "",
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  phone: "",
  email: "",
};

export default function SelectionProcessCheckoutPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const processId = params?.id ?? "";
  const { user, isLoading: isUserLoading } = useUser();

  const [state, setState] = useState<StudentApplicationState | null>(null);
  const [payer, setPayer] = useState<PayerForm>(EMPTY_PAYER);
  const [examsCount, setExamsCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmReplacement, setConfirmReplacement] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const operation = useRef<{ signature: string; key: string } | null>(null);

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
        throw new Error(describeError(body?.code || body?.error, "Não foi possível carregar sua inscrição."));
      }

      const data = body.data as StudentApplicationState;
      setState(data);
      if (data.payment?.examsCount) setExamsCount(data.payment.examsCount);

      if (data.status === "PAID_PENDING_LEAGUES" || data.status === "ENROLLED") {
        router.replace(`/processos-seletivos/${processId}/painel`);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro ao carregar sua inscrição.");
    } finally {
      setIsLoading(false);
    }
  }, [processId, user, router]);

  useEffect(() => {
    if (!isUserLoading) void load();
  }, [isUserLoading, load]);

  useEffect(() => {
    if (user?.email && !payer.email) setPayer((previous) => ({ ...previous, email: user.email as string }));
    if (user?.name && !payer.name) setPayer((previous) => ({ ...previous, name: user.name as string }));
  }, [user, payer.email, payer.name]);

  const price = useMemo(() => {
    const tiers = state?.process.pricingTiers ?? [];
    const exact = tiers.find((tier) => tier.examsCount === examsCount);
    if (exact) return exact.unitTotalPrice;

    const single = tiers.find((tier) => tier.examsCount === 1);
    return single ? single.unitTotalPrice * examsCount : null;
  }, [state, examsCount]);

  const requestPayment = async (replace: boolean) => {
    setIsSubmitting(true);
    setError("");
    const payload = { examsCount, payer, ...(replace ? { previousSessionId: state?.payment?.sessionId } : {}) };
    const signature = JSON.stringify(payload);
    if (operation.current?.signature !== signature) operation.current = { signature, key: crypto.randomUUID() };
    try {
      const response = await fetch(`/api/v1/selective-processes/${processId}/checkout${replace ? '/replace' : ''}`, {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": operation.current.key },
        body: signature,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.success) {
        if (response.status === 428 && body.error === 'PROFILE_INCOMPLETE') { router.push(`/perfil?returnTo=${encodeURIComponent(`/processos-seletivos/${processId}/inscricao`)}`); return; }
        if (body?.error === "ALREADY_ENROLLED") {
          await load();
          throw new Error("O pagamento anterior foi aprovado. A quantidade paga foi mantida.");
        }
        throw new Error(describeError(body?.error, "Não foi possível concluir a operação. Atualize a situação antes de tentar novamente."));
      }
      window.location.href = body.data.init_point as string;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao processar pagamento.");
      setConfirmReplacement(false);
      setIsSubmitting(false);
    }
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!acknowledged || !state?.canCheckout || isSubmitting) return;
    const pending = state.payment;
    if (pending && pending.canReplace && (pending.examsCount !== examsCount || new Date(pending.expiresAt).getTime() <= Date.now())) {
      setConfirmReplacement(true);
      return;
    }
    void requestPayment(false);
  };

  if (isUserLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-label="Carregando inscrição" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-shell flex min-h-screen flex-col items-center justify-center gap-5 text-center">
        <LogIn className="h-12 w-12 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Entre para se inscrever</h1>
        <a
          href={`/api/auth/login?returnTo=${encodeURIComponent(`/processos-seletivos/${processId}/inscricao`)}`}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Fazer login
        </a>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100";

  const maxExams = Math.min(4, state?.process.maxExamsPerApplication ?? 1, state?.process.exams.length ?? 0);

  return (
    <main className="page-shell min-h-screen space-y-8 pb-16 pt-28"><ProfileGate returnTo={`/processos-seletivos/${processId}/inscricao`}>
      <Link
        href={`/processos-seletivos/${processId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao processo seletivo
      </Link>

      <header className="glass-panel-strong rounded-3xl border border-white/80 p-6 dark:border-white/10 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Inscrição</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Pagamento da inscrição</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Escolha por quantas ligas você quer concorrer e informe os dados de cobrança. O pagamento é
          processado pelo Mercado Pago; as ligas são selecionadas depois da confirmação.
        </p>
      </header>

      {state?.payment && (
        <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
            Situação da sua cobrança
          </h2>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            {state.payment.examsCount ?? "—"} liga(s) · {state.payment.totalAmount === null ? "Valor em verificação" : formatCurrency(state.payment.totalAmount)}.
            Prazo do checkout: {formatDateTime(state.payment.expiresAt)}.
          </p>
          {state.payment.init_point && new Date(state.payment.expiresAt).getTime() > Date.now() && <a
            href={state.payment.init_point}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <CreditCard className="h-4 w-4" /> Retomar pagamento
          </a>}
        </section>
      )}

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {state && !state.canCheckout && (
        <section role="status" className="glass-panel rounded-3xl border p-6">
          <p>{STATUS_LABELS[state.status]}</p>
          <button type="button" onClick={() => void load()} className="mt-4 rounded-2xl border px-4 py-2">Atualizar situação</button>
        </section>
      )}
      {state?.canCheckout && <form onSubmit={submit} className="space-y-6">
        <section className="glass-panel surface-outline space-y-4 rounded-[28px] border border-white/70 p-6 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Quantas ligas você quer disputar?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Este processo seletivo permite até {maxExams} liga{maxExams === 1 ? "" : "s"} por inscrição.
          </p>

          <div className="flex flex-wrap gap-3">
            {Array.from({ length: maxExams }, (_, index) => index + 1).map((count) => (
              <button
                type="button"
                key={count}
                disabled={isSubmitting}
                onClick={() => { setExamsCount(count); setAcknowledged(false); }}
                className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors ${
                  examsCount === count
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-white/70 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
                }`}
              >
                {count} liga{count === 1 ? "" : "s"}
              </button>
            ))}
          </div>

          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {price === null ? "Valor ainda não publicado pela CLAM" : `Total: ${formatCurrency(price)}`}
          </p>
        </section>

        <section className="glass-panel surface-outline space-y-4 rounded-[28px] border border-white/70 p-6 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Dados de cobrança</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome completo *</span>
              <input
                required
                value={payer.name}
                onChange={(event) => setPayer({ ...payer, name: event.target.value })}
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">CPF *</span>
              <input
                required
                inputMode="numeric"
                value={payer.cpf}
                onChange={(event) => setPayer({ ...payer, cpf: event.target.value })}
                className={inputClass}
                placeholder="000.000.000-00"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Celular *</span>
              <input
                required
                inputMode="tel"
                value={payer.phone}
                onChange={(event) => setPayer({ ...payer, phone: event.target.value })}
                className={inputClass}
                placeholder="(34) 99999-9999"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">E-mail *</span>
              <input
                required
                type="email"
                value={payer.email}
                onChange={(event) => setPayer({ ...payer, email: event.target.value })}
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">CEP *</span>
              <input
                required
                inputMode="numeric"
                value={payer.zipCode}
                onChange={(event) => setPayer({ ...payer, zipCode: event.target.value })}
                className={inputClass}
                placeholder="38400-000"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Bairro *</span>
              <input
                required
                value={payer.neighborhood}
                onChange={(event) => setPayer({ ...payer, neighborhood: event.target.value })}
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Rua *</span>
              <input
                required
                value={payer.street}
                onChange={(event) => setPayer({ ...payer, street: event.target.value })}
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Número *</span>
              <input
                required
                value={payer.number}
                onChange={(event) => setPayer({ ...payer, number: event.target.value })}
                className={inputClass}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Complemento</span>
              <input
                value={payer.complement}
                onChange={(event) => setPayer({ ...payer, complement: event.target.value })}
                className={inputClass}
                placeholder="Apartamento, bloco, referência"
              />
            </label>
          </div>

          <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
            Os dados são usados apenas para emitir a cobrança no Mercado Pago. O DADG não armazena dados do
            seu cartão.
          </p>
        </section>

        <label className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm dark:border-blue-900 dark:bg-blue-950/30">
          <input type="checkbox" required checked={acknowledged} disabled={isSubmitting} onChange={e => setAcknowledged(e.target.checked)} className="mt-1" />
          <span>Após a aprovação do pagamento, você não poderá alterar a quantidade de provas nem comprar provas adicionais para esta inscrição.</span>
        </label>
        <button
          type="submit"
          disabled={isSubmitting || price === null || price <= 0 || !acknowledged || maxExams === 0}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Ir para o pagamento
        </button>
      </form>}
      {confirmReplacement && state?.payment && (
        <AlertDialog.Root open={confirmReplacement} onOpenChange={open => { if (!isSubmitting) setConfirmReplacement(open); }}><AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4"><AlertDialog.Content className="max-h-[90dvh] w-full max-w-lg overflow-y-auto" onEscapeKeyDown={event => { if (isSubmitting) event.preventDefault(); }}>
          <section className="w-full max-w-lg space-y-5 rounded-[28px] bg-white p-6 shadow-xl dark:bg-slate-950">
            <AlertDialog.Title className="text-xl font-semibold">Alterar quantidade de provas</AlertDialog.Title>
            <AlertDialog.Description>Para alterar a quantidade, precisamos cancelar sua cobrança atual e gerar uma nova.</AlertDialog.Description>
            <p>Atual: {state.payment.examsCount} liga(s) — {state.payment.totalAmount === null ? "—" : formatCurrency(state.payment.totalAmount)}.</p>
            <p>Nova: {examsCount} liga(s) — {price === null ? "—" : formatCurrency(price)}.</p>
            <p className="text-sm">Se o pagamento anterior já tiver sido aprovado, manteremos a quantidade paga.</p>
            <div className="flex flex-wrap justify-end gap-3">
              <AlertDialog.Cancel asChild><button type="button" disabled={isSubmitting} className="rounded-2xl border px-4 py-3">Voltar</button></AlertDialog.Cancel>
              <button type="button" disabled={isSubmitting} onClick={() => void requestPayment(true)} className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
                {isSubmitting ? "Verificando e cancelando..." : "Cancelar cobrança atual e gerar nova"}
              </button>
            </div>
          </section>
          </AlertDialog.Content></div></AlertDialog.Portal></AlertDialog.Root>
      )}
    </ProfileGate></main>
  );
}
