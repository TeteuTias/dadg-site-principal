"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";
import { InfoCard } from "@/app/components/site-sections";
import {
  formatCpf,
  onlyDigits,
  validateProfileFields,
  type ProfileSummary,
} from "@/lib/profile/client";

export type OwnProfile = {
  exists: boolean;
  name: string | null;
  cpf: string | null;
  cpfMasked: string;
  period: number | null;
  registrationNumber?: string; birthDate?: string; phone?: string; contactEmail?: string;
  clamMissingFields?: string[];
  complete: boolean;
  privacyNoticeRequired: boolean;
  updatedAt: string | null;
};
export type PrivacyNotice = {
  version: string;
  hash: string;
  title: string;
  introduction: string;
  sections: Array<{ title: string; text: string }>;
  acceptanceText: string;
};
type Account = { email: string; picture: string; suggestedName: string };

export default function PersonalDataPanel({
  profile,
  account,
  notice,
  onSaved,
  returnTo,
}: {
  profile: OwnProfile;
  account: Account;
  notice: PrivacyNotice;
  onSaved: (profile: OwnProfile, summary: ProfileSummary) => void;
  returnTo: string | null;
}) {
  const initial = () => ({
    name: profile.name || (!profile.exists ? account.suggestedName : "") || "",
    cpf: profile.cpf ? formatCpf(profile.cpf) : "",
    period: profile.period ? String(profile.period) : "",
    registrationNumber: onlyDigits(profile.registrationNumber || ''), birthDate: profile.birthDate || '',
    phone: onlyDigits(profile.phone || ''), contactEmail: profile.contactEmail || account.email || '',
  });
  const [editing, setEditing] = useState(
    !profile.complete || profile.privacyNoticeRequired || Boolean(returnTo?.startsWith('/processos-seletivos') && profile.clamMissingFields?.length),
  );
  const [form, setForm] = useState(initial);
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const refs = {
    name: useRef<HTMLInputElement>(null),
    cpf: useRef<HTMLInputElement>(null),
    period: useRef<HTMLSelectElement>(null),
    registrationNumber: useRef<HTMLInputElement>(null),
    birthDate: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    contactEmail: useRef<HTMLInputElement>(null),
    privacyAccepted: useRef<HTMLInputElement>(null),
  };
  useEffect(() => {
    setForm(initial());
    setEditing(!profile.complete || profile.privacyNoticeRequired || Boolean(returnTo?.startsWith('/processos-seletivos') && profile.clamMissingFields?.length));
    setAccepted(false);
  }, [profile]);
  const startEditing = () => {
    setForm(initial());
    setEditing(true);
    setAccepted(false);
    setErrors({});
    setMessage("");
    setStatus("idle");
  };
  const cancel = () => {
    setForm(initial());
    setEditing(false);
    setErrors({});
    setMessage("");
    setStatus("idle");
  };
  const focusFirst = (next: Record<string, string>) => {
    for (const key of ["name", "cpf", "period", "registrationNumber", "birthDate", "phone", "contactEmail", "privacyAccepted"] as const) {
      if (next[key]) {
        refs[key].current?.focus();
        break;
      }
    }
  };

  async function save(event: FormEvent) {
    event.preventDefault();
    if (status === "saving") return;
    const checked = validateProfileFields(form, Boolean(returnTo?.startsWith('/processos-seletivos')));
    const next: Record<string, string> = { ...checked.errors };
    if (profile.privacyNoticeRequired && !accepted)
      next.privacyAccepted = "Leia e aceite o aviso de privacidade vigente.";
    if (!checked.data || Object.keys(next).length) {
      setErrors(next);
      setStatus("error");
      setMessage("Revise os campos destacados.");
      focusFirst(next);
      return;
    }
    setStatus("saving");
    setErrors({});
    setMessage("");
    try {
      const response = await fetch("/api/perfil/proxy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checked.data,
          privacyAccepted: profile.privacyNoticeRequired ? accepted : false,
          noticeVersion: notice.version,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const backendFields = data.fields || {};
        setErrors(backendFields);
        setStatus("error");
        setMessage(
          data.code === "CPF_ALREADY_IN_USE"
            ? "Este CPF já está associado a um perfil."
            : data.error || "Não foi possível salvar o perfil.",
        );
        focusFirst(backendFields);
        return;
      }
      onSaved(data.profile, data.summary);
      setStatus("success");
      setMessage("Dados salvos com sucesso.");
      setEditing(false);
      setAccepted(false);
    } catch {
      setStatus("error");
      setMessage("Erro de conexão. Seus dados continuam no formulário.");
    }
  }

  if (!editing)
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <InfoCard
          title="Dados pessoais"
          description="Seus dados são usados nas novas inscrições e documentos relacionados."
        >
          <dl className="grid gap-5 sm:grid-cols-2">
            <Read
              label="Nome completo"
              value={profile.name || "Não informado"}
            />
            <Read
              label="E-mail da conta"
              value={account.email || "Não informado"}
            />
            <Read label="CPF" value={profile.cpfMasked} />
            <Read label="Matrícula / RA" value={profile.registrationNumber || 'Não informado'} />
            <Read label="Nascimento" value={profile.birthDate?.split('-').reverse().join('/') || 'Não informado'} />
            <Read label="Telefone" value={profile.phone || 'Não informado'} />
            <Read label="E-mail de contato" value={profile.contactEmail || 'Não informado'} />
            <Read
              label="Período"
              value={
                profile.period ? `${profile.period}º período` : "Não informado"
              }
            />
          </dl>
          <button
            type="button"
            onClick={startEditing}
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-[var(--brand-900)] dark:bg-blue-600"
          >
            <Edit3 size={16} />
            Editar dados
          </button>
          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-5 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
            >
              <CheckCircle2 size={16} className="mr-2 inline" />
              {message}
              {returnTo ? (
                <a href={returnTo} className="ml-2 underline">
                  Continuar para a inscrição
                </a>
              ) : null}
            </div>
          ) : null}
        </InfoCard>
        <InfoCard
          title="Privacidade protegida"
          description="O CPF aparece mascarado nesta tela e é criptografado no servidor."
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-sm font-semibold text-[var(--brand-800)]">
            <LockKeyhole size={16} />
            Dados protegidos
          </div>
        </InfoCard>
      </div>
    );

  return (
    <form
      onSubmit={save}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="glass-panel surface-outline rounded-[32px] border border-white/70 p-6 sm:p-7 dark:border-white/10">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome completo" error={errors.name}>
            <input
              ref={refs.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              className={inputClass}
            />
          </Field>
          <Field label="E-mail da conta" hint="Gerenciado pela sua conta Auth0">
            <input
              value={account.email}
              readOnly
              aria-readonly
              className={`${inputClass} cursor-not-allowed opacity-75`}
            />
          </Field>
          <Field label="CPF" error={errors.cpf}>
            <input
              ref={refs.cpf}
              value={form.cpf}
              onChange={(e) =>
                setForm({ ...form, cpf: formatCpf(e.target.value) })
              }
              onBlur={() => {
                const result = validateProfileFields({
                  ...form,
                  name: form.name || "Nome válido",
                  period: form.period || "1",
                });
                setErrors((current) => ({
                  ...current,
                  cpf: result.errors.cpf || "",
                }));
              }}
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              aria-invalid={Boolean(errors.cpf)}
              className={inputClass}
            />
          </Field>
          <Field label="Período" error={errors.period}>
            <select
              ref={refs.period}
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              aria-invalid={Boolean(errors.period)}
              className={inputClass}
            >
              <option value="">Selecione</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}º período
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2"><h2 className="font-semibold">Dados para inscrições na CLAM</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Informe seus dados de candidato para as listas de provas e o contato dos organizadores.</p></div>
          {([['registrationNumber', 'Matrícula / RA', 'text'], ['birthDate', 'Data de nascimento', 'date'], ['phone', 'Telefone com DDD', 'tel'], ['contactEmail', 'E-mail de contato', 'email']] as const).map(([field, label, type]) => (
            <Field key={field} label={label} error={errors[field]}><input ref={refs[field]} disabled={status === 'saving'} aria-invalid={Boolean(errors[field])} className={inputClass} type={type} inputMode={field === 'registrationNumber' || field === 'phone' ? 'numeric' : undefined} value={form[field]} maxLength={field === 'registrationNumber' || field === 'phone' ? undefined : 254} onChange={e => setForm(previous => ({ ...previous, [field]: field === 'registrationNumber' || field === 'phone' ? onlyDigits(e.target.value) : e.target.value }))} /></Field>
          ))}
        </div>
        {status === "error" ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-5 rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
          >
            {message}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === "saving"}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white disabled:opacity-60 dark:bg-blue-600"
          >
            {status === "saving" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}{" "}
            {status === "saving" ? "Salvando..." : "Salvar alterações"}
          </button>
          {profile.complete ? (
            <button
              type="button"
              onClick={cancel}
              disabled={status === "saving"}
              className="h-12 rounded-full border border-slate-300 px-6 text-sm font-semibold dark:border-slate-700"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </div>
      <InfoCard
        title="Aviso de Privacidade e LGPD"
        description={
          profile.privacyNoticeRequired
            ? "Leia o aviso vigente. O aceite é necessário para concluir este cadastro."
            : "Seu aceite da versão vigente já está registrado."
        }
      >
        {profile.privacyNoticeRequired ? (
          <>
            <label className="flex items-start gap-3 rounded-[20px] border border-[rgba(9,66,125,.14)] bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60">
              <input
                ref={refs.privacyAccepted}
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 h-5 w-5"
              />
              <span className="text-sm leading-6 text-slate-700 dark:text-slate-200">
                {notice.acceptanceText}
              </span>
            </label>
            {errors.privacyAccepted ? (
              <p className="mt-2 text-sm text-rose-600">
                {errors.privacyAccepted}
              </p>
            ) : null}
          </>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <ShieldCheck size={17} />
            Aceite vigente
          </div>
        )}
        <PrivacyDialog notice={notice} />
      </InfoCard>
    </form>
  );
}

const inputClass =
  "h-14 w-full rounded-[20px] border border-[rgba(9,66,125,0.14)] bg-white/88 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-100";
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-sm text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
function Read({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-slate-950 dark:text-white">
        {value}
      </dd>
    </div>
  );
}
function PrivacyDialog({ notice }: { notice: PrivacyNotice }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-[var(--brand-800)] underline underline-offset-4"
        >
          Ler o aviso completo
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1100] bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="glass-panel-strong fixed left-1/2 top-1/2 z-[1110] max-h-[86vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-white/80 p-6 shadow-2xl dark:border-white/10">
          <Dialog.Title className="text-2xl font-bold text-slate-950 dark:text-white">
            {notice.title}
          </Dialog.Title>
          <Dialog.Description className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {notice.introduction}
          </Dialog.Description>
          <div className="mt-5 space-y-5">
            {notice.sections.map((section) => (
              <section key={section.title}>
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {section.text}
                </p>
              </section>
            ))}
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Fechar aviso"
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <button
              type="button"
              className="mt-6 h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white dark:bg-blue-600"
            >
              Entendi
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
