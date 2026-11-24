"use client";

import Link from "next/link";
import { useState, useTransition, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import type { Resultado } from "@/lib/zitadel/fluxo";
import { checarSenha, type Regras } from "@/lib/zitadel/senha";
import { cadastrar, continuarComo, entrar, entrarComGoogle, esqueciSenha, novaSenha, reenviarCodigo, verificarEmail } from "./actions";

const ERRO_REDE = "Não foi possível falar com o servidor de login agora. Tente de novo em instantes.";

/** Roda uma Server Action; se ela devolver `ir`, leva o navegador para lá (mantendo o botão em "carregando"). */
function useAcao() {
  const [pendente, iniciar] = useTransition();
  const [navegando, setNavegando] = useState(false);
  const [res, setRes] = useState<Resultado>();
  const executar = (acao: () => Promise<Resultado>) =>
    iniciar(async () => {
      try {
        const r = await acao();
        if (r.ir) {
          setNavegando(true);
          window.location.assign(r.ir);
          return;
        }
        setRes(r);
      } catch {
        setRes({ erro: ERRO_REDE });
      }
    });
  return { executar, res, ocupado: pendente || navegando };
}

const enviar = (fn: (fd: FormData) => void) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  fn(new FormData(e.currentTarget));
};

// ---------- peças visuais ----------

export function Aviso({ tom, children }: { tom: "erro" | "ok" | "info"; children: ReactNode }) {
  const cor = {
    erro: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/25 dark:bg-red-500/10 dark:text-red-200",
    ok: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-200",
    info: "border-blue-100 bg-blue-50/80 text-[var(--brand-900)] dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100",
  }[tom];
  return (
    <div role={tom === "erro" ? "alert" : "status"} className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${cor}`}>
      {children}
    </div>
  );
}

const CAMPO =
  "mt-1.5 block w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-700)] focus:ring-4 focus:ring-blue-500/15 aria-[invalid=true]:border-red-400 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400";

type CampoProps = { rotulo: string; nome: string; erro?: string; ajuda?: ReactNode } & Omit<ComponentProps<"input">, "name">;

function Campo({ rotulo, nome, erro, ajuda, ...input }: CampoProps) {
  const id = `c-${nome}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">{rotulo}</label>
      <input id={id} name={nome} aria-invalid={erro ? true : undefined} aria-describedby={erro ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined} className={CAMPO} {...input} />
      {erro ? <p id={`${id}-erro`} className="mt-1.5 text-sm text-red-600 dark:text-red-300">{erro}</p> : null}
      {!erro && ajuda ? <div id={`${id}-ajuda`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{ajuda}</div> : null}
    </div>
  );
}

function CampoSenha({ extra, rotulo, nome, erro, ajuda, ...input }: CampoProps & { extra?: ReactNode }) {
  const [ver, setVer] = useState(false);
  const id = `c-${nome}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">{rotulo}</label>
        {extra}
      </div>
      <div className="relative">
        <input
          id={id}
          name={nome}
          type={ver ? "text" : "password"}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined}
          className={`${CAMPO} pr-12`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVer((v) => !v)}
          aria-label={ver ? "Esconder senha" : "Mostrar senha"}
          aria-pressed={ver}
          className="absolute right-1.5 top-1/2 mt-[3px] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {ver ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {erro ? <p id={`${id}-erro`} className="mt-1.5 text-sm text-red-600 dark:text-red-300">{erro}</p> : null}
      {!erro && ajuda ? <div id={`${id}-ajuda`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{ajuda}</div> : null}
    </div>
  );
}

function Botao({ ocupado, carregando, children, estilo = "principal", ...btn }: { ocupado: boolean; carregando: string; estilo?: "principal" | "secundario" } & ComponentProps<"button">) {
  const cor =
    estilo === "principal"
      ? "bg-[var(--brand-900)] text-white shadow-[0_12px_30px_rgba(7,48,89,0.25)] hover:bg-[var(--brand-800)] dark:bg-blue-600 dark:hover:bg-blue-500"
      : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10";
  return (
    <button
      type="submit"
      disabled={ocupado}
      aria-busy={ocupado || undefined}
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:cursor-wait disabled:opacity-75 ${cor}`}
      {...btn}
    >
      {ocupado ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {ocupado ? carregando : children}
    </button>
  );
}

const LINK = "font-semibold text-[var(--brand-800)] underline-offset-4 hover:underline dark:text-blue-300";

function Checklist({ senha, regras }: { senha: string; regras: Regras }) {
  return (
    <ul className="mt-1 grid gap-1 sm:grid-cols-2" aria-label="Regras da senha">
      {checarSenha(senha, regras).map((c) => (
        <li key={c.texto} className={`flex items-center gap-1.5 ${c.ok ? "text-emerald-600 dark:text-emerald-300" : ""}`}>
          <Check className={`h-3.5 w-3.5 shrink-0 ${c.ok ? "opacity-100" : "opacity-30"}`} aria-hidden />
          <span>{c.texto}<span className="sr-only">{c.ok ? " (atendida)" : " (pendente)"}</span></span>
        </li>
      ))}
    </ul>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Divisor() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />ou<span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

/** Mostra a mensagem de sucesso com o link para voltar a entrar. */
function Sucesso({ res }: { res: Resultado }) {
  return (
    <div className="grid gap-5">
      <Aviso tom="ok">{res.ok}</Aviso>
      {res.voltar ? (
        <Link href={res.voltar} className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--brand-900)] px-5 text-[15px] font-semibold text-white hover:bg-[var(--brand-800)] dark:bg-blue-600 dark:hover:bg-blue-500">
          Entrar
        </Link>
      ) : (
        <a href="https://www.dadg.com.br" className={`${LINK} text-center text-sm`}>Ir para o site do DADG</a>
      )}
    </div>
  );
}

// ---------- telas ----------

export function FormLogin({ authRequest, loginHint, erroInicial, google, cadastro }: { authRequest: string; loginHint?: string; erroInicial?: string; google: boolean; cadastro: boolean }) {
  const login = useAcao();
  const g = useAcao();
  const res = login.res;
  const q = `?authRequest=${encodeURIComponent(authRequest)}`;

  return (
    <div>
      {google ? (
        <>
          <form onSubmit={enviar(() => g.executar(() => entrarComGoogle(authRequest)))} className="grid gap-3">
            {g.res?.erro ? <Aviso tom="erro">{g.res.erro}</Aviso> : null}
            <Botao ocupado={g.ocupado} carregando="Abrindo o Google…" estilo="secundario" disabled={login.ocupado || g.ocupado}>
              <GoogleG /> Entrar com Google
            </Botao>
          </form>
          <Divisor />
        </>
      ) : null}

      <form onSubmit={enviar((fd) => login.executar(() => entrar(fd)))} className="grid gap-4" noValidate>
        <input type="hidden" name="authRequest" value={authRequest} />
        {res?.erro || (!res && erroInicial) ? <Aviso tom="erro">{res?.erro ?? erroInicial}</Aviso> : null}
        {res?.ok ? <Aviso tom="ok">{res.ok}</Aviso> : null}
        <Campo autoFocus={!loginHint} rotulo="E-mail" nome="email" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} required defaultValue={loginHint} erro={login.res?.campos?.email} />
        <CampoSenha
          rotulo="Senha"
          nome="senha"
          autoComplete="current-password"
          required
          autoFocus={Boolean(loginHint)}
          erro={login.res?.campos?.senha}
          extra={<Link href={`/entrar/esqueci-senha${q}`} className={`${LINK} text-xs`}>Esqueci minha senha</Link>}
        />
        <div className="mt-1">
          <Botao ocupado={login.ocupado} carregando="Entrando…" disabled={login.ocupado || g.ocupado}>Entrar</Botao>
        </div>
      </form>

      {cadastro ? (
        <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
          Ainda não tem conta? <Link href={`/entrar/cadastro${q}`} className={LINK}>Criar conta grátis</Link>
        </p>
      ) : null}
    </div>
  );
}

export function ContinuarComo({ authRequest, contas }: { authRequest: string; contas: Array<{ sessionId: string; nome: string; loginName: string }> }) {
  const { executar, res, ocupado } = useAcao();
  const [escolhida, setEscolhida] = useState<string>();
  return (
    <div className="grid gap-3">
      {res?.erro ? <Aviso tom="erro">{res.erro}</Aviso> : null}
      {contas.map((c) => (
        <button
          key={c.sessionId}
          type="button"
          disabled={ocupado}
          onClick={() => {
            setEscolhida(c.sessionId);
            executar(() => continuarComo(c.sessionId, authRequest));
          }}
          className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 text-left transition hover:border-[var(--brand-500)] hover:shadow-[0_12px_30px_rgba(7,48,89,0.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:cursor-wait dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-blue-400"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-900)] text-base font-semibold text-white dark:bg-blue-600">
            {(c.nome || c.loginName).trim().charAt(0).toUpperCase() || "?"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-slate-500 dark:text-slate-400">Continuar como</span>
            <span className="block truncate font-semibold text-slate-900 dark:text-white">{c.nome || c.loginName}</span>
            {c.nome && c.nome !== c.loginName ? <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{c.loginName}</span> : null}
          </span>
          {ocupado && escolhida === c.sessionId ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-label="Entrando" /> : null}
        </button>
      ))}
      <Link
        href={`/entrar/login?authRequest=${encodeURIComponent(authRequest)}&outra=1`}
        className="mt-2 flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
      >
        Usar outra conta
      </Link>
    </div>
  );
}

export function FormCadastro({ authRequest, regras }: { authRequest?: string; regras: Regras }) {
  const { executar, res, ocupado } = useAcao();
  const [senha, setSenha] = useState("");
  const q = authRequest ? `?authRequest=${encodeURIComponent(authRequest)}` : "";
  return (
    <form onSubmit={enviar((fd) => executar(() => cadastrar(fd)))} className="grid gap-4" noValidate>
      {authRequest ? <input type="hidden" name="authRequest" value={authRequest} /> : null}
      {res?.erro ? <Aviso tom="erro">{res.erro}</Aviso> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Nome" nome="nome" autoComplete="given-name" required autoFocus erro={res?.campos?.nome} />
        <Campo rotulo="Sobrenome" nome="sobrenome" autoComplete="family-name" required erro={res?.campos?.sobrenome} />
      </div>
      <Campo rotulo="E-mail" nome="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required erro={res?.campos?.email} />
      <CampoSenha rotulo="Senha" nome="senha" autoComplete="new-password" required value={senha} onChange={(e) => setSenha(e.target.value)} erro={res?.campos?.senha} ajuda={<Checklist senha={senha} regras={regras} />} />
      <CampoSenha rotulo="Confirme a senha" nome="confirmar" autoComplete="new-password" required erro={res?.campos?.confirmar} />
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Ao criar a conta, você concorda com os <Link href="/termos" target="_blank" className={LINK}>Termos de Uso</Link> e a{" "}
        <Link href="/privacidade" target="_blank" className={LINK}>Política de Privacidade</Link>.
      </p>
      <Botao ocupado={ocupado} carregando="Criando sua conta…">Criar conta</Botao>
      {authRequest ? (
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Já tem conta? <Link href={`/entrar/login${q}`} className={LINK}>Entrar</Link>
        </p>
      ) : null}
    </form>
  );
}

export function FormVerificar({ userId, codigo, enviado }: { userId: string; codigo?: string; enviado: boolean }) {
  const verificar = useAcao();
  const reenviar = useAcao();
  if (verificar.res?.ok) return <Sucesso res={verificar.res} />;
  return (
    <div className="grid gap-5">
      {enviado && !codigo && !reenviar.res ? (
        <Aviso tom="info">Enviamos um link de confirmação para o seu e-mail. Abra o e-mail e clique no link, ou digite o código abaixo. Confira também a caixa de spam.</Aviso>
      ) : null}
      {verificar.res?.erro ? <Aviso tom="erro">{verificar.res.erro}</Aviso> : null}
      <form onSubmit={enviar((fd) => verificar.executar(() => verificarEmail(userId, String(fd.get("codigo") ?? ""))))} className="grid gap-4" noValidate>
        {codigo ? (
          <input type="hidden" name="codigo" value={codigo} />
        ) : (
          <Campo rotulo="Código de confirmação" nome="codigo" autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} required erro={verificar.res?.campos?.codigo} />
        )}
        <Botao ocupado={verificar.ocupado} carregando="Confirmando…">Confirmar meu e-mail</Botao>
      </form>
      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
        {reenviar.res?.ok ? <Aviso tom="ok">{reenviar.res.ok}</Aviso> : null}
        {reenviar.res?.erro ? <Aviso tom="erro">{reenviar.res.erro}</Aviso> : null}
        {!reenviar.res?.ok ? (
          <form onSubmit={enviar(() => reenviar.executar(() => reenviarCodigo(userId)))} className="flex flex-wrap items-center justify-between gap-3">
            <span>Não recebeu o e-mail?</span>
            <button type="submit" disabled={reenviar.ocupado} className={`${LINK} inline-flex items-center gap-1.5 disabled:opacity-60`}>
              {reenviar.ocupado ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
              {reenviar.ocupado ? "Enviando…" : "Reenviar código"}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export function FormEsqueci({ authRequest }: { authRequest?: string }) {
  const { executar, res, ocupado } = useAcao();
  const voltar = authRequest ? `/entrar/login?authRequest=${encodeURIComponent(authRequest)}` : undefined;
  if (res?.ok) return <Sucesso res={{ ...res, voltar }} />;
  return (
    <form onSubmit={enviar((fd) => executar(() => esqueciSenha(fd)))} className="grid gap-4" noValidate>
      {authRequest ? <input type="hidden" name="authRequest" value={authRequest} /> : null}
      {res?.erro ? <Aviso tom="erro">{res.erro}</Aviso> : null}
      <Campo rotulo="E-mail da conta" nome="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required autoFocus erro={res?.campos?.email} />
      <Botao ocupado={ocupado} carregando="Enviando…">Enviar link</Botao>
      {voltar ? (
        <p className="mt-2 text-center text-sm"><Link href={voltar} className={LINK}>Voltar para entrar</Link></p>
      ) : null}
    </form>
  );
}

export function FormNovaSenha({ userId, codigo, regras }: { userId: string; codigo: string; regras: Regras }) {
  const { executar, res, ocupado } = useAcao();
  const [senha, setSenha] = useState("");
  if (res?.ok) return <Sucesso res={res} />;
  return (
    <form onSubmit={enviar((fd) => executar(() => novaSenha(fd)))} className="grid gap-4" noValidate>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="code" value={codigo} />
      {res?.erro ? (
        <Aviso tom="erro">
          {res.erro} <Link href="/entrar/esqueci-senha" className={LINK}>Pedir novo link</Link>
        </Aviso>
      ) : null}
      <CampoSenha rotulo="Nova senha" nome="senha" autoComplete="new-password" required autoFocus value={senha} onChange={(e) => setSenha(e.target.value)} erro={res?.campos?.senha} ajuda={<Checklist senha={senha} regras={regras} />} />
      <CampoSenha rotulo="Confirme a nova senha" nome="confirmar" autoComplete="new-password" required erro={res?.campos?.confirmar} />
      <Botao ocupado={ocupado} carregando="Salvando…">Salvar nova senha</Botao>
    </form>
  );
}
