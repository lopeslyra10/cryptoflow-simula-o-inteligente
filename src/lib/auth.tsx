import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Papel } from "./mock";

export type Sessao = { nome: string; email: string; papel: Papel; organizacao?: string };

type Ctx = {
  sessao: Sessao | null;
  pronto: boolean;
  entrar: (s: Sessao) => void;
  sair: () => void;
};

const AuthCtx = createContext<Ctx>({ sessao: null, pronto: false, entrar: () => {}, sair: () => {} });
const CHAVE = "cryptoflow.sessao";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) setSessao(JSON.parse(bruto) as Sessao);
    } catch {
      /* ignora */
    }
    setPronto(true);
  }, []);

  const valor = useMemo<Ctx>(
    () => ({
      sessao,
      pronto,
      entrar: (s) => {
        setSessao(s);
        localStorage.setItem(CHAVE, JSON.stringify(s));
      },
      sair: () => {
        setSessao(null);
        localStorage.removeItem(CHAVE);
      },
    }),
    [sessao, pronto],
  );

  return <AuthCtx.Provider value={valor}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

export const rotaPorPapel: Record<Papel, "/app/cliente" | "/app/empresa" | "/app/admin"> = {
  cliente: "/app/cliente",
  empresa: "/app/empresa",
  admin: "/app/admin",
};
