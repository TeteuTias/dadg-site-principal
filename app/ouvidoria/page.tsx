"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Copy, EyeOff, FileUp, Search, UserRound, X } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";
import { CATEGORIAS, LIMITES, TIPOS } from "@/lib/ouvidoria-opcoes";
import { cn } from "@/lib/utils";

const ACEITOS = "image/jpeg,image/png,image/webp,application/pdf";
const MB = 1024 * 1024;

const campo =
  "w-full rounded-[18px] border border-[rgba(9,66,125,0.16)] bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.1)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100";

export default function OuvidoriaPage() {
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [anonimo, setAnonimo] = useState(true);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [ficha, setFicha] = useState("");
  const [estado, setEstado] = useState<"livre" | "enviando" | "erro">("livre");
  const [erro, setErro] = useState("");
  const [protocolo, setProtocolo] = useState("");
  const [copiado, setCopiado] = useState(false);
  const inputArquivo = useRef<HTMLInputElement>(null);
  const caixaErro = useRef<HTMLDivElement>(null);

  async function pegarFicha() {
    try {
      const r = await fetch("/api/ouvidoria", { cache: "no-store" });
      const d = await r.json();
      if (typeof d?.ficha === "string") setFicha(d.ficha);
    } catch {
      /* sem ficha o servidor recusa e a mensagem de erro orienta a recarregar */
    }
  }

  useEffect(() => {
    void pegarFicha();
  }, []);

  function falhar(texto: string) {
    setEstado("erro");
    setErro(texto);
    requestAnimationFrame(() => caixaErro.current?.focus());
  }

  function escolherArquivo(f: File | null) {
    if (f && f.size > LIMITES.anexoBytes) {
      if (inputArquivo.current) inputArquivo.current.value = "";
      setArquivo(null);
      falhar("O anexo passou de 4 MB. Envie um arquivo menor ou tire uma foto com menos resolução.");
      return;
    }
    setArquivo(f);
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (estado === "enviando") return;
    if (!tipo) return falhar("Escolha o tipo da manifestação.");
    if (!categoria) return falhar("Escolha o assunto.");
    if (mensagem.trim().length < LIMITES.mensagemMin)
      return falhar(`Conte um pouco mais: a descrição precisa de pelo menos ${LIMITES.mensagemMin} caracteres.`);

    const dados = new FormData(event.currentTarget);
    if (!dados.get("consentimento")) return falhar("Marque a autorização de tratamento dos dados para enviar.");
    dados.set("anonimo", anonimo ? "true" : "false");
    dados.set("ficha", ficha);
    if (!arquivo) dados.delete("anexo");

    setEstado("enviando");
    setErro("");
    try {
      const r = await fetch("/api/ouvidoria", { method: "POST", body: dados });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) {
        if (r.status === 400) void pegarFicha();
        return falhar(d?.error ?? (r.status === 429 ? "Muitas tentativas. Aguarde um minuto." : "Não foi possível enviar. Tente de novo."));
      }
      setProtocolo(d.protocolo ?? "");
      setEstado("livre");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      falhar("Sem conexão com o servidor. Confira sua internet e tente de novo.");
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(protocolo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* o número continua visível para copiar à mão */
    }
  }

  if (protocolo) {
    return (
      <div className="space-y-10 pt-28 pb-8">
        <section className="page-shell">
          <div className="glass-panel surface-outline mx-auto max-w-2xl rounded-[32px] border border-white/70 px-6 py-10 text-center sm:px-10 dark:border-white/10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Check className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="mt-5 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">Manifestação registrada</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-slate-600 dark:text-slate-300">
              Guarde o número abaixo. É com ele que você acompanha o andamento e lê a resposta do DADG.
            </p>

            <div className="mx-auto mt-7 flex max-w-sm flex-col items-center gap-3 rounded-[24px] border border-[rgba(9,66,125,0.14)] bg-white px-5 py-5 dark:border-white/10 dark:bg-slate-900/80">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Protocolo</span>
              <span className="select-all whitespace-nowrap font-mono text-xl font-semibold tracking-wide text-[var(--brand-900)] sm:text-[28px] sm:tracking-wider dark:text-white">
                {protocolo}
              </span>
              <button
                type="button"
                onClick={copiar}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgba(9,66,125,0.16)] px-4 text-sm font-semibold text-[var(--brand-800)] hover:bg-[var(--brand-50)] dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5"
              >
                {copiado ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copiado ? "Copiado" : "Copiar número"}
              </button>
            </div>

            <ol className="mx-auto mt-8 max-w-md space-y-3 text-left text-[15px] leading-6 text-slate-600 dark:text-slate-300">
              <Passo n={1}>A diretoria do DADG lê a sua manifestação e muda o andamento para “em análise”.</Passo>
              <Passo n={2}>Quando houver retorno, a resposta aparece na página de acompanhamento.</Passo>
              <Passo n={3}>
                {anonimo
                  ? "Como o envio foi anônimo, o DADG não tem como falar com você: acompanhe pelo protocolo."
                  : "Se precisar de mais detalhes, o DADG pode escrever para o e-mail que você informou."}
              </Passo>
            </ol>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/ouvidoria/acompanhar#${protocolo}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
              >
                Acompanhar agora <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProtocolo("");
                  setTipo("");
                  setCategoria("");
                  setMensagem("");
                  setArquivo(null);
                  void pegarFicha();
                }}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(9,66,125,0.16)] px-6 text-sm font-semibold text-slate-700 hover:bg-white dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Enviar outra
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-28 pb-8 sm:space-y-12">
      <PageHero
        eyebrow="Ouvidoria"
        title="Fale com o DADG"
        description="Reclamações, sugestões, elogios, denúncias e pedidos chegam direto à diretoria. Você pode se identificar ou enviar de forma anônima, e acompanha tudo por um número de protocolo."
        aside={
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Como funciona</p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <Passo n={1}>Você preenche o formulário abaixo.</Passo>
              <Passo n={2}>Recebe na hora um número de protocolo.</Passo>
              <Passo n={3}>A diretoria analisa e publica a resposta no acompanhamento.</Passo>
            </ol>
            <Link
              href="/ouvidoria/acompanhar"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--brand-800)] hover:underline dark:text-blue-300"
            >
              <Search className="h-4 w-4" aria-hidden /> Já tenho um protocolo
            </Link>
          </div>
        }
      />

      <section className="page-shell">
        <form
          onSubmit={enviar}
          noValidate
          className="glass-panel surface-outline relative space-y-9 rounded-[32px] border border-white/70 px-5 py-6 sm:px-10 sm:py-12 dark:border-white/10 [&>*]:mx-auto [&>*]:max-w-3xl"
        >
          {/* Só robô preenche este campo. */}
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
            <label htmlFor="ouv-site">Site</label>
            <input id="ouv-site" name="site" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <Grupo numero={1} titulo="O que você quer registrar?">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Tipo da manifestação">
              {TIPOS.map((t) => (
                <label
                  key={t.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[20px] border bg-white px-4 py-3.5 transition dark:bg-slate-900/80",
                    tipo === t.value
                      ? "border-[var(--brand-800)] ring-2 ring-[rgba(9,66,125,0.14)] dark:border-blue-400"
                      : "border-[rgba(9,66,125,0.12)] hover:border-[rgba(9,66,125,0.3)] dark:border-white/10",
                  )}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={t.value}
                    checked={tipo === t.value}
                    onChange={() => setTipo(t.value)}
                    className="mt-1 h-4 w-4 accent-[var(--brand-800)]"
                  />
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-950 dark:text-white">{t.label}</span>
                    <span className="mt-0.5 block text-sm leading-5 text-slate-500 dark:text-slate-400">{t.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Grupo>

          <Grupo numero={2} titulo="Sobre qual assunto?">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Assunto">
              {CATEGORIAS.map((c) => (
                <label
                  key={c.value}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[rgba(9,66,125,0.2)]",
                    categoria === c.value
                      ? "border-[var(--brand-800)] bg-[var(--brand-800)] text-white"
                      : "border-[rgba(9,66,125,0.16)] bg-white text-slate-700 hover:border-[rgba(9,66,125,0.32)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200",
                  )}
                >
                  <input
                    type="radio"
                    name="categoria"
                    value={c.value}
                    checked={categoria === c.value}
                    onChange={() => setCategoria(c.value)}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </Grupo>

          <Grupo numero={3} titulo="Conte o que aconteceu" rotulo="ouv-mensagem">
            <textarea
              id="ouv-mensagem"
              name="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={7}
              maxLength={LIMITES.mensagemMax}
              required
              aria-describedby="ouv-mensagem-dica"
              placeholder="O que aconteceu, quando, onde e quem estava envolvido. Quanto mais claro, mais rápido o DADG consegue agir."
              className={cn(campo, "py-3.5 leading-7")}
            />
            <div id="ouv-mensagem-dica" className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {tipo === "denuncia"
                  ? "Em denúncias, descreva fatos. Se houver risco imediato, procure também a coordenação do curso."
                  : `Mínimo de ${LIMITES.mensagemMin} caracteres.`}
              </span>
              <span>
                {mensagem.length} / {LIMITES.mensagemMax}
              </span>
            </div>

            <div className="mt-5">
              <input
                ref={inputArquivo}
                id="ouv-anexo"
                name="anexo"
                type="file"
                accept={ACEITOS}
                className="sr-only"
                onChange={(e) => escolherArquivo(e.target.files?.[0] ?? null)}
              />
              {arquivo ? (
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(9,66,125,0.16)] bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/80">
                  <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                    {arquivo.name} <span className="text-slate-400">· {(arquivo.size / MB).toFixed(1)} MB</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setArquivo(null);
                      if (inputArquivo.current) inputArquivo.current.value = "";
                    }}
                    aria-label="Remover anexo"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="ouv-anexo"
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[18px] border border-dashed border-[rgba(9,66,125,0.24)] px-4 py-3 text-sm text-slate-600 hover:bg-white has-[:focus-visible]:ring-4 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <FileUp className="h-5 w-5 shrink-0 text-[var(--brand-700)]" aria-hidden />
                  <span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Anexar arquivo (opcional)</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Foto ou PDF, até 4 MB. Só a diretoria vê. Fotos perdem os dados de localização; num PDF, confira se o seu nome não aparece.</span>
                  </span>
                </label>
              )}
            </div>
          </Grupo>

          <Grupo numero={4} titulo="Quer se identificar?">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Identificação">
              <Opcao ativo={anonimo} onClick={() => setAnonimo(true)} icone={<EyeOff className="h-5 w-5" aria-hidden />} titulo="Enviar anônimo">
                Não pedimos nome nem e-mail. Você acompanha só pelo protocolo.
              </Opcao>
              <Opcao ativo={!anonimo} onClick={() => setAnonimo(false)} icone={<UserRound className="h-5 w-5" aria-hidden />} titulo="Me identificar">
                O DADG pode falar com você se precisar de mais detalhes.
              </Opcao>
            </div>

            {!anonimo ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Rotulo id="ouv-nome" texto="Nome">
                  <input id="ouv-nome" name="nome" autoComplete="name" maxLength={LIMITES.nomeMax} required className={cn(campo, "h-12")} />
                </Rotulo>
                <Rotulo id="ouv-email" texto="E-mail">
                  <input
                    id="ouv-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={LIMITES.emailMax}
                    required
                    className={cn(campo, "h-12")}
                  />
                </Rotulo>
                <Rotulo id="ouv-turma" texto="Turma ou período (opcional)" className="sm:col-span-2">
                  <input id="ouv-turma" name="turma" maxLength={LIMITES.turmaMax} placeholder="Ex.: turma 39 ou 5º período" className={cn(campo, "h-12")} />
                </Rotulo>
              </div>
            ) : null}
          </Grupo>

          <div className="space-y-5 border-t border-[rgba(9,66,125,0.1)] pt-7 dark:border-white/10">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <input type="checkbox" name="consentimento" value="true" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--brand-800)]" />
              <span>
                Autorizo o DADG a tratar os dados desta manifestação só para analisar e responder, conforme a{" "}
                <Link href="/privacidade" className="font-semibold text-[var(--brand-800)] underline underline-offset-2 dark:text-blue-300">
                  Política de Privacidade
                </Link>{" "}
                (LGPD).
              </span>
            </label>

            {estado === "erro" ? (
              <div
                ref={caixaErro}
                tabIndex={-1}
                role="alert"
                className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 outline-none dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
              >
                {erro}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={estado === "enviando"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-7 text-sm font-semibold text-white transition hover:bg-[var(--brand-900)] disabled:opacity-60 sm:w-auto"
            >
              {estado === "enviando" ? "Enviando..." : "Enviar manifestação"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Grupo({ numero, titulo, rotulo, children }: { numero: number; titulo: string; rotulo?: string; children: ReactNode }) {
  const Titulo = rotulo ? "label" : "p";
  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">{titulo}</legend>
      <Titulo
        {...(rotulo ? { htmlFor: rotulo } : {})}
        className="flex items-center gap-3 text-lg font-semibold text-slate-950 dark:text-white"
        aria-hidden={rotulo ? undefined : true}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-50)] text-sm font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-200">
          {numero}
        </span>
        {titulo}
      </Titulo>
      {children}
    </fieldset>
  );
}

function Opcao({ ativo, onClick, icone, titulo, children }: { ativo: boolean; onClick: () => void; icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={ativo}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-[20px] border bg-white px-4 py-3.5 text-left transition dark:bg-slate-900/80",
        ativo
          ? "border-[var(--brand-800)] ring-2 ring-[rgba(9,66,125,0.14)] dark:border-blue-400"
          : "border-[rgba(9,66,125,0.12)] hover:border-[rgba(9,66,125,0.3)] dark:border-white/10",
      )}
    >
      <span className={cn("mt-0.5", ativo ? "text-[var(--brand-800)] dark:text-blue-300" : "text-slate-400")}>{icone}</span>
      <span>
        <span className="block text-[15px] font-semibold text-slate-950 dark:text-white">{titulo}</span>
        <span className="mt-0.5 block text-sm leading-5 text-slate-500 dark:text-slate-400">{children}</span>
      </span>
    </button>
  );
}

function Rotulo({ id, texto, className, children }: { id: string; texto: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {texto}
      </label>
      {children}
    </div>
  );
}

function Passo({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-50)] text-xs font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-200">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}
