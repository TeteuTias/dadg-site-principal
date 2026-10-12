"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LoaderCircle, Search, ShieldCheck } from "lucide-react";
import { PageHero, InfoCard } from "@/app/components/site-sections";

type Result = { _id: string; ownerName: string; eventName: string };

function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");

  // Versões antigas guardavam a busca e os resultados (dados pessoais) no navegador.
  useEffect(() => {
    try {
      localStorage.removeItem("certificateSearch");
      localStorage.removeItem("certificateResults");
    } catch {
      /* Storage can be unavailable in private contexts. */
    }
  }, []);

  async function search(event?: FormEvent, nextPage = 1) {
    event?.preventDefault();
    const value = nextPage === 1 ? query.trim() : activeQuery;
    if (value.length < 3) {
      setError("Digite pelo menos 3 caracteres.");
      return;
    }
    if (nextPage === 1) {
      setResults([]);
      setSearched(false);
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/get/myCertificate/${encodeURIComponent(value)}?page=${nextPage}`,
        { cache: "no-store" },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || body.error || "Não foi possível consultar os certificados.");
      setResults(nextPage === 1 ? body.data : [...results, ...body.data]);
      setMore(body.hasMore === true);
      setPage(nextPage);
      setActiveQuery(value);
      setSearched(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="certificate-search" className="sr-only">
            Pesquisar certificado
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="certificate-search"
            name="certificateSearch"
            type="text"
            minLength={3}
            maxLength={120}
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="certificate-search-input h-14 w-full rounded-full border border-[rgba(9,66,125,0.14)] bg-white pl-12 pr-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-400"
            placeholder="Digite nome, e-mail, CPF ou evento"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-[var(--brand-900)] transition-colors disabled:opacity-70"
        >
          Buscar
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {error ? (
        <div
          role="alert"
          className="rounded-[26px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      ) : null}

      {loading && results.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center rounded-[26px] border border-white/70 bg-white px-5 py-10 text-sm font-medium text-slate-500 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-400"
        >
          <LoaderCircle className="mr-3 h-5 w-5 animate-spin text-[var(--brand-800)]" />
          Carregando certificados...
        </div>
      ) : null}

      {searched && !loading && results.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[26px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white px-5 py-10 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400"
        >
          Nenhum resultado encontrado.
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="space-y-4">
          <p
            aria-live="polite"
            className="px-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400"
          >
            {results.length}
            {more ? "+" : ""} {results.length === 1 && !more ? "certificado encontrado" : "certificados encontrados"}
          </p>
          {results.map((certificate) => (
            <Link
              key={certificate._id}
              href={`/certificados/meuCertificado/${certificate._id}`}
              className="block rounded-[26px] border border-white/70 bg-white p-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/80"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Certificado</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{certificate.eventName}</h3>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
                  Abrir
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              <div className="mt-5 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Titular</p>
                  <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">{certificate.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Código verificador</p>
                  <p className="mt-2 break-all font-medium text-slate-800 dark:text-slate-100">{certificate._id}</p>
                </div>
              </div>
            </Link>
          ))}

          {more ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => void search(undefined, page + 1)}
              className="mx-auto flex h-12 items-center justify-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-6 text-sm font-semibold text-slate-800 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition-colors hover:border-[var(--brand-800)] disabled:opacity-70 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function CertificadosPage() {
  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Certificados"
        title="Busca e validação"
        description="Pesquise certificados por nome, e-mail, CPF ou nome do evento. Cada certificado possui um código verificador único."
        aside={
          <div className="glass-panel surface-outline rounded-[28px] border border-white/70 p-5 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-[0_12px_32px_rgba(7,48,89,0.12)]">
                <Image src="/logoDadg02.png" alt="Logo DADG" fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Acesso direto</p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Consulta oficial de certificados</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="page-shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="glass-panel surface-outline rounded-[32px] border border-white/70 p-6 sm:p-7 dark:border-white/10">
          <SearchInput />
        </div>

        <div className="space-y-5">
          <InfoCard
            title="Como pesquisar"
            description="Use parte do nome ou do evento, ou então o CPF, o e-mail ou o código verificador completos. Ao encontrar o certificado, abra para visualizar e baixar."
          />
          <InfoCard title="Validação" description="Cada certificado exibe um código verificador único para consulta e conferência.">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-sm font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
              <ShieldCheck className="h-4 w-4" />
              Código individual
            </div>
          </InfoCard>
          <InfoCard title="Na sua conta" description="Veja os certificados vinculados à sua conta e peça a revisão dos antigos na área pessoal.">
            <Link
              href="/perfil/certificados"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-sm font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100"
            >
              Meus certificados
              <ArrowRight className="h-4 w-4" />
            </Link>
          </InfoCard>
          <InfoCard title="Atendimento" description="Se o certificado não aparecer ou houver alguma divergência, use a ouvidoria.">
            <Link
              href="/ouvidoria"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)] transition-colors"
            >
              Abrir ouvidoria
              <ArrowRight className="h-4 w-4" />
            </Link>
          </InfoCard>
        </div>
      </section>
    </div>
  );
}
