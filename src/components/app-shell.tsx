import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { LogOut, ShieldAlert } from "lucide-react";
import { useAuth, rotaPorPapel } from "@/lib/auth";
import type { Papel } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
        CF
      </span>
      {!compacto && (
        <span className="font-display text-lg font-semibold tracking-tight">CryptoFlow</span>
      )}
    </span>
  );
}

export function AvisoSimulacao({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-foreground/90",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
      <p>
        <strong>Ambiente de simulação educacional.</strong> Todos os dados, cotações e operações são
        fictícios. O CryptoFlow não executa transações reais e não é uma corretora.
      </p>
    </div>
  );
}

type ItemNav = { rotulo: string; para: string };

export function AppShell({
  papel,
  titulo,
  itens,
  ativo,
  onSelecionar,
  children,
}: {
  papel: Papel;
  titulo: string;
  itens: { chave: string; rotulo: string }[];
  ativo: string;
  onSelecionar: (chave: string) => void;
  children: ReactNode;
}) {
  const { sessao, pronto, sair } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pronto) return;
    if (!sessao) navigate({ to: "/login/$tipo", params: { tipo: papel }, replace: true });
    else if (sessao.papel !== papel)
      navigate({ to: rotaPorPapel[sessao.papel], replace: true });
  }, [pronto, sessao, papel, navigate]);

  if (!pronto || !sessao || sessao.papel !== papel) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Carregando ambiente de simulação…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/">
            <Logo />
          </Link>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            {titulo}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{sessao.nome}</p>
              <p className="text-xs text-muted-foreground">{sessao.organizacao ?? sessao.email}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => { sair(); navigate({ to: "/" }); }}>
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 pb-2">
          {itens.map((i) => (
            <button
              key={i.chave}
              onClick={() => onSelecionar(i.chave)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors",
                ativo === i.chave
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60",
              )}
            >
              {i.rotulo}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <AvisoSimulacao />
        {children}
      </main>
    </div>
  );
}

export function NavPublica({ links }: { links: ItemNav[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="hidden items-center gap-6 md:flex">
      {links.map((l) => (
        <a
          key={l.para}
          href={l.para}
          className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-foreground",
            pathname === l.para && "text-foreground",
          )}
        >
          {l.rotulo}
        </a>
      ))}
    </nav>
  );
}
