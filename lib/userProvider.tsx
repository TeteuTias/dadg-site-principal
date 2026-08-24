"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProfileSummary } from "@/lib/profile/client";

type UserStatus = "anonymous" | "loading" | "ready" | "error";
interface UserContextValue {
  isAuthenticated: boolean;
  displayName: string;
  profileComplete: boolean;
  privacyNoticeRequired: boolean;
  status: UserStatus;
  refreshProfileSummary: () => Promise<void>;
  updateProfileSummary: (summary: ProfileSummary) => void;
}

const fallback: ProfileSummary = { displayName: "Aluno DADG", complete: false, privacyNoticeRequired: true };
const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children, isAuthenticated }: { children: ReactNode; isAuthenticated: boolean }) {
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
  const value = useMemo(() => ({ isAuthenticated, displayName: summary.displayName?.trim() || fallback.displayName, profileComplete: summary.complete, privacyNoticeRequired: summary.privacyNoticeRequired, status, refreshProfileSummary, updateProfileSummary }), [isAuthenticated, summary, status, refreshProfileSummary, updateProfileSummary]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUserContext() { const context=useContext(UserContext); if(!context) throw new Error("useUserContext must be used within a UserProvider"); return context; }
