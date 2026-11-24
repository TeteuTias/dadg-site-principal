"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProfileSummary } from "@/lib/profile/client";
import type { Usuario } from "@/lib/auth/util";

type UserStatus = "anonymous" | "loading" | "ready" | "error";
interface UserContextValue {
  isAuthenticated: boolean;
  user: Usuario | null;
  displayName: string;
  profileComplete: boolean;
  privacyNoticeRequired: boolean;
  status: UserStatus;
  refreshProfileSummary: () => Promise<void>;
  updateProfileSummary: (summary: ProfileSummary) => void;
}

const fallback: ProfileSummary = { displayName: "Aluno DADG", complete: false, privacyNoticeRequired: true };
const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children, isAuthenticated, user }: { children: ReactNode; isAuthenticated: boolean; user: Usuario | null }) {
  const [summary, setSummary] = useState(fallback);
  const [status, setStatus] = useState<UserStatus>(isAuthenticated ? "loading" : "anonymous");
  const refreshProfileSummary = useCallback(async () => {
    if (!isAuthenticated) { setSummary(fallback); setStatus("anonymous"); return; }
    setStatus((current) => current === "ready" ? current : "loading");
    try {
      const response = await fetch("/api/perfil/summary", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error("summary");
      setSummary(data.summary || fallback); setStatus("ready");
    } catch { setStatus("error"); }
  }, [isAuthenticated]);
  useEffect(() => {
    localStorage.removeItem("dadg_saved_cpf"); localStorage.removeItem("dadg_saved_email");
    void refreshProfileSummary();
  }, [refreshProfileSummary]);
  const updateProfileSummary = useCallback((next: ProfileSummary) => { setSummary(next); setStatus("ready"); }, []);
  const value = useMemo(() => ({ isAuthenticated, user, displayName: summary.displayName?.trim() || fallback.displayName, profileComplete: summary.complete, privacyNoticeRequired: summary.privacyNoticeRequired, status, refreshProfileSummary, updateProfileSummary }), [isAuthenticated, user, summary, status, refreshProfileSummary, updateProfileSummary]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
/** Usuário da sessão (vem do servidor no layout; mesmo formato do antigo useUser do Auth0). */
export function useUser() { const { user } = useUserContext(); return { user, isLoading: false }; }
export function useUserContext() { const context=useContext(UserContext); if(!context) throw new Error("useUserContext must be used within a UserProvider"); return context; }
