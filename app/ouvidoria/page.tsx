"use client";

import { useState } from "react";
import "./style.css";

const MIN_LENGTH = 20;
const MAX_LENGTH = 2000;

export default function OuvidoriaPage() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const r = await fetch("/api/ouvidoria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, message, website }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok || !data.ok) {
      setStatus("error");
      setError(data?.error ?? "Não foi possível enviar.");
      return;
    }

    setStatus("ok");
    setTopic("");
    setMessage("");
    setWebsite("");
  }

  return (
    <main className="ouvidoria-container">
      <div className="ouvidoria-content">
        <header className="ouvidoria-header">
          <h1 className="ouvidoria-title">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Ouvidoria
          </h1>
          <p className="ouvidoria-subtitle">
            Selecione um tópico e descreva sua demanda. Sua opinião é importante para nós.
            (Mínimo {MIN_LENGTH} caracteres)
          </p>
        </header>

        <div className="ouvidoria-form-card">
          <form onSubmit={onSubmit} className="ouvidoria-form">
            <div className="ouvidoria-honeypot" aria-hidden>
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <div className="ouvidoria-field">
              <label htmlFor="ouvidoria-topic">Tópico</label>
              <select
                id="ouvidoria-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="infraestrutura">Infraestrutura</option>
                <option value="problemas da turma">Problemas da turma</option>
                <option value="problemas com a coordenação">Problemas com a coordenação</option>
                <option value="problemas com os professores">Problemas com os professores</option>
              </select>
            </div>

            <div className="ouvidoria-field">
              <label htmlFor="ouvidoria-message">Mensagem</label>
              <textarea
                id="ouvidoria-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                minLength={MIN_LENGTH}
                maxLength={MAX_LENGTH}
                required
                placeholder="Descreva com detalhes sua sugestão, reclamação ou dúvida..."
              />
              <span className="ouvidoria-char-count">
                {message.length} / {MAX_LENGTH} caracteres
              </span>
            </div>

            <button type="submit" className="ouvidoria-submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando..." : "Enviar"}
            </button>

            {status === "ok" && (
              <p className="ouvidoria-feedback success" role="status">
                Mensagem enviada. Obrigado!
              </p>
            )}
            {status === "error" && (
              <p className="ouvidoria-feedback error" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
