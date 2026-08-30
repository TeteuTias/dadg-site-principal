"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InformacoesIniciaisPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Proteção extra (além do gate): se já tiver name, vai para home.
    void (async () => {
      const res = await fetch("/api/onboarding/status", { cache: "no-store" }).catch(() => null);
      if (!res || !res.ok) return;
      const data = (await res.json()) as { needsOnboarding?: boolean };
      if (data?.needsOnboarding === false) router.replace("/");
    })();
  }, [mounted, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("saving");

    const res = await fetch("/api/onboarding/save-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setStatus("error");
      setError("Não foi possível salvar suas informações. Tente novamente.");
      return;
    }

    router.replace("/");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Informações iniciais</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Para continuar, precisamos apenas do seu nome.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Seu nome"
            required
            minLength={2}
          />
        </label>

        {status === "error" && error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-slate-950 px-4 py-2 text-white disabled:opacity-60"
        >
          {status === "saving" ? "Salvando..." : "Continuar"}
        </button>
      </form>
    </main>
  );
}
