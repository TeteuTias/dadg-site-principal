"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";

type Certificate = { _id: string; eventName: string; ownerName: string };
type Claim = {
  _id: string;
  certificateId: string;
  status: string;
  reason?: string;
};

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Em análise", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" },
  APPROVED: { label: "Aprovado", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" },
  REJECTED: { label: "Não aprovado", className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300" },
  REVOKED: { label: "Vínculo removido", className: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" },
};

const eyebrow = "text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400";
const panel = "glass-panel surface-outline rounded-[32px] border border-white/70 p-6 sm:p-7 dark:border-white/10";
const inputClass =
  "mt-2 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100";
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-900)] disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500";

export default function MyCertificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<{ message: string; page: number } | null>(null);
  const loadInFlight = useRef(false);
  const submitInFlight = useRef(false);
  const [auto, setAuto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);

  const fail = (error: unknown) => {
    setFailed(true);
    setFeedback(error instanceof Error ? error.message : "Falha de conexão.");
  };

  async function load(p = 1) {
    // Bloqueia inclusive dois cliques antes de o React atualizar o botão.
    if (loadInFlight.current) return;
    loadInFlight.current = true;
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/v1/user/certificates?page=${p}`);
      const body = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(body.error || "Entre na conta e complete seu perfil.");
      if (!Array.isArray(body.data) || !Array.isArray(body.claims))
        throw new Error("Não foi possível consultar seus certificados. Tente novamente.");
      setItems((previous) => (p === 1 ? body.data : [...previous, ...body.data]));
      setClaims(body.claims);
      setAuto(body.automaticEnabled === true);
      setMore(body.hasMore === true);
      setPage(p);
      setLoaded(true);
    } catch (error) {
      setLoadError({
        message: error instanceof Error ? error.message : "Falha de conexão.",
        page: p,
      });
    } finally {
      loadInFlight.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(path: string, body?: unknown) {
    if (submitInFlight.current || loadInFlight.current) return;
    submitInFlight.current = true;
    setBusy(true);
    setFailed(false);
    setFeedback("");
    try {
      const response = await fetch(`/api/v1/user/certificates/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Não foi possível concluir. Tente novamente.");
      setFeedback(
        path === "link"
          ? `${result.linked} certificado(s) vinculado(s).`
          : "Solicitação enviada para revisão.",
      );
      if (path === "claims") {
        setCode("");
        setMessage("");
      }
      await load();
    } catch (error) {
      fail(error);
    } finally {
      submitInFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <main className="space-y-9 pt-28 pb-12">
      <div className="page-shell">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Meu perfil
        </Link>
      </div>

      <PageHero
        eyebrow="Área do aluno"
        title="Meus certificados"
        description="Certificados vinculados à sua conta. Os históricos podem ser vinculados sem criar inscrições antigas."
        actions={
          auto ? (
            <button type="button" disabled={busy || loading} onClick={() => void submit("link")} className={primaryButton}>
              Procurar correspondências verificadas
            </button>
          ) : undefined
        }
      />

      <section className="page-shell space-y-6">
        {loadError ? (
          <div role="alert" className="rounded-[26px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <p>{loadError.message}</p>
            <button
              type="button"
              disabled={busy || loading}
              onClick={() => {
                if (!submitInFlight.current) void load(loadError.page);
              }}
              className="mt-3 font-semibold underline disabled:opacity-70"
            >
              Tentar novamente
            </button>
          </div>
        ) : null}
        {feedback ? (
          <p
            role={failed ? "alert" : "status"}
            className={`rounded-[26px] border px-5 py-4 text-sm font-medium ${
              failed
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
            }`}
          >
            {feedback}
          </p>
        ) : null}

        {!loaded && loading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center rounded-[26px] border border-white/70 bg-white px-5 py-10 text-sm font-medium text-slate-500 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-400"
          >
            <LoaderCircle className="mr-3 h-5 w-5 animate-spin text-[var(--brand-800)]" />
            Carregando certificados...
          </div>
        ) : !loaded ? null : items.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white px-5 py-10 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
            Nenhum certificado vinculado à sua conta ainda.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((certificate) => (
              <Link
                key={certificate._id}
                href={`/certificados/meuCertificado/${certificate._id}`}
                className="block rounded-[26px] border border-white/70 bg-white p-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={eyebrow}>Certificado</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{certificate.eventName}</h2>
                  </div>
                  <span className="inline-flex flex-none items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
                    Abrir
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <p className={`mt-5 ${eyebrow}`}>Titular</p>
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">{certificate.ownerName}</p>
              </Link>
            ))}
          </div>
        )}

        {more ? (
          <button
            type="button"
            disabled={loading || busy}
            onClick={() => {
              if (!submitInFlight.current) void load(page + 1);
            }}
            className="mx-auto flex h-12 items-center justify-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-6 text-sm font-semibold text-slate-800 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition-colors hover:border-[var(--brand-800)] disabled:opacity-70 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
          >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Carregando..." : "Carregar mais"}
          </button>
        ) : null}
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-2">
        <form
          className={`${panel} space-y-5`}
          onSubmit={(event) => {
            event.preventDefault();
            void submit("claims", { certificateId: code.trim(), message });
          }}
        >
          <div>
            <p className={eyebrow}>Certificado antigo</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Solicitar vínculo</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Localize o código na{" "}
              <Link href="/certificados" className="font-semibold text-blue-600 underline dark:text-blue-300">
                consulta pública
              </Link>
              . A organização verificará a titularidade; coincidência de nome não é suficiente.
            </p>
          </div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Código do certificado
            <input
              disabled={busy}
              required
              pattern="[a-fA-F0-9]{24}"
              title="Código verificador com 24 caracteres"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className={inputClass}
              autoComplete="off"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Informações para conferência
            <textarea
              disabled={busy}
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={inputClass}
            />
          </label>
          <button disabled={busy || loading} className={primaryButton}>
            {busy ? "Enviando..." : "Enviar solicitação"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className={panel}>
          <p className={eyebrow}>Acompanhamento</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Minhas solicitações</h2>
          {!loaded ? (
            <p role="status" className="mt-5 text-sm text-slate-600 dark:text-slate-300">
              {loading ? "Carregando solicitações..." : "Não foi possível carregar suas solicitações."}
            </p>
          ) : claims.length === 0 ? (
            <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">Nenhuma solicitação enviada.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {claims.map((claim) => {
                const status = STATUS[claim.status] || { label: claim.status, className: STATUS.REVOKED.className };
                return (
                  <li
                    key={claim._id}
                    className="rounded-[20px] border border-white/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900/72"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="break-all font-mono text-xs text-slate-600 dark:text-slate-300">{claim.certificateId}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                    </div>
                    {claim.reason ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{claim.reason}</p> : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
